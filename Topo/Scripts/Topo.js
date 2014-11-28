

$(function () {
    $(".chosen-select").chosen();
});
topo = {};
topo.Game = function (KaartID) {
    var cookie = $.cookie("players");
    var game = cookie ? JSON.parse(cookie) : {};
    var name = this.CurrentPlayerName = game.CurrentPlayerName || 'Onbekend';
    this.players = game.players || {};

    topo.player = this.players[name] = this.players[name] || {};
    topo.player.CurrentKaartID = KaartID;
    topo.player.Kaarten = topo.player.Kaarten || {};

    topo.Kaart = topo.player.Kaarten[KaartID] = topo.player.Kaarten[KaartID] || {};
    topo.Kaart.Selected = topo.Kaart.Selected || {};
    topo.Kaart.GoodAnswers = topo.Kaart.GoodAnswers || {};
    topo.Kaart.WrongAnswers = topo.Kaart.WrongAnswers || {};
    topo.Kaart.Niveau = topo.Kaart.Niveau || "A";
    topo.Kaart.Language = topo.Kaart.Language || "nl";
    topo.Kaart.AnswerType = topo.Kaart.AnswerType || "Click";

    this.save = function () {
        $.cookie("players", JSON.stringify(topo.game), { expires: 365 });
    };
}
topo.showModule = function (module) {
    switch (module) {
        case 'QuestionModule': {
            $(".EditModule").hide();
            $(".ResultModule").hide();
            $(".QuestionModule").show();
            $(".SelectionModule").hide();
            break;
        }
        case 'EditModule': {

            $(".ResultModule").hide();
            $(".QuestionModule").hide();
            $(".SelectionModule").hide();
            $(".EditModule").show();
            this.editModule.createEditableTable();
            break;
        }
        case 'ResultModule': {

            $(".ResultModule").show();
            $(".EditModule").hide();
            $(".QuestionModule").hide();
            $(".SelectionModule").hide();
            this.result.createResultTable();
            break;

        }
        case 'SelectionModule': {
            this.selectionModule.createSelection();
            $(".EditModule").hide();
            $(".ResultModule").hide();
            $(".QuestionModule").hide();
            $(".SelectionModule").show();
            break;
        }
    }
}
topo.SayPlaats = function (plaats, language) {
    language = language || topo.Kaart.Language;
    var audio = new Audio('/TTS/index?q=' + (plaats) + '&tl=' + (language));
    audio.play();
}

//Question Module
topo.Question = function () {
    var _this = this;

    //Display Values
    this.setLanguage = function (value) {
        topo.Kaart.Language = value;
        $("#cboLanguage").val(value);
        topo.game.save();
    }
    this.setNiveau = function (value) {
        topo.Kaart.Niveau = value;
        $("#cboNiveau").val(value);
        topo.game.save();
    }
    this.setAnswerType = function (value) {
        topo.Kaart.AnswerType = value;
        if (value == 'Type') {
            $('#TypeQuestion').show();
            $('#ClickQuestion').hide();
        }
        else {
            $('#ClickQuestion').show();
            $('#TypeQuestion').hide();
        }
        $('#radAnswerType input[name="AnswerResponse"][value="' + value + '"]').prop('checked', true);
        topo.game.save();
    }
    this.setNumberOfQuestion = function (value) {
        this.numberOfQuestion = value;
        $('#txtNumberOfQuestion').val(value);
    }
    this.setNumberOfQuestionDone = function (value) {
        this.numberOfQuestionDone = value;
        $('#txtNumberOfQuestionDone').html(value);
    }
    this.setScore = function (value) {
        this.Score = value;
        $('#txtScore').html(value.toFixed(1));
    }
    this.setLanguagePlaats = function (value) {
        this.languagePlaats = value || topo.Kaart.Language;
    }

    this.setQuestion = function (value) {
        this.question = value;
        $('#txtQuestion').html(value);
        topo.SayPlaats(value, this.languagePlaats);
    }
    this.setQuestionNumber = function () {
        var x = 0;
        $("#map area").each(function () {
            if (this.alt && this.alt.split(':').length >= 3 && (this.attributes['status'] === true || this.attributes['status'] === false) || this.attributes['current']) {
                x++;
            }
        });
        $("#txtQuestionNumber").html((x) + ' (van ' + this.getMaxQuestionNumber() + ')');
    }
    this.fixShapeAtrrubute = function () {
        $("#map area").each(function () {
            switch(this.coords.split(',').length)
            {
                case 3: this.shape = 'circle'; break;
                case 4: this.shape= 'rect'; break;
                default: this.shape= 'poly'; break;
            }
        });
    }

    //Get Values
    this.getCorrectAnswer = function () {
        return this.question;
    }
    this.isSelected = function (niveau, AltText, ownSelection) {
        return AltText && AltText.split(':').length >= 1
                    && (
                        (niveau.indexOf(AltText.split(':')[0]) > -1)
                        || (niveau == "D" && ownSelection[AltText.split(':')[1]])
                    );
    }
    this.getMaxQuestionNumber = function () {
        var x = 0;
        $("#map area").each(function () {
            if (_this.isSelected(topo.Kaart.Niveau, this.alt, topo.Kaart.Selected)) {
                x = x + 1;
            };
        });
        return x;
    }
    //Logica
    this.gotoNextQuestion = function () {
        var max = this.getMaxQuestionNumber();
        var done = this.numberOfQuestionDone;
        var nextQuestionNumber = Math.floor(Math.random() * (max - done));
        //console.debug('random=' + nextQuestionNumber + ' done=' + done + ' max=' + max);
        var x = 0;
        $("#map area").each(function (index) {
            if (_this.isSelected(topo.Kaart.Niveau, this.alt, topo.Kaart.Selected) && !this.attributes['done']) {
                if (x == nextQuestionNumber) {
                    _this.setLanguagePlaats(this.alt.split(':').length > 3 ? this.alt.split(':')[3] : null);
                    _this.setQuestion(this.alt.split(':')[2]);
                    this.attributes['current'] = true;
                    _this.CurrentIndex = index;
                }
                else {
                    this.attributes['current'] = false;
                }
                x = x + 1;
            };
        });
        _this.setQuestionNumber();
    }
    this.setStatusCurrentQuestion = function (value) {
        $("#map area").each(function (index) {
            if (this.attributes['current'] == true) {
                this.attributes['status'] = value;
                this.attributes['done'] = true;
                _this.numberOfQuestionDone++;
                this.attributes['current'] = false;
            }
        });
    }

    this.validate = function (answer) {
        if (topo.Kaart.AnswerType == 'Click' && answer == _this.getCorrectAnswer()) {
            _this.numberOfQuestionGood++
            _this.setStatusCurrentQuestion(true);
            _this.gotoNextQuestion();
            _this.setScore((_this.numberOfQuestionGood / _this.getMaxQuestionNumber()) * 10);
        }
        else {
            $('.canvas-area[data-image-url]')[0].Highlight(_this.CurrentIndex, _this.getCorrectAnswer());
            _this.setStatusCurrentQuestion(false);
            var a = new Audio("/Content/wrong.mp3");
            a.onended = function () {
                $('.canvas-area[data-image-url]')[0].clean();
                _this.gotoNextQuestion();
                _this.setScore((_this.numberOfQuestionGood / _this.getMaxQuestionNumber()) * 10);
            };
            a.play();

        }
    };
    //Init
    this.resetScoreAndMap = function () {
        $("#map area").each(function () {
            delete this.attributes['status']
            delete this.attributes['current']
            delete this.attributes['done']
        });
        this.CurrentIndex = null;
        this.Finished = false;
        this.setNumberOfQuestion(this.getMaxQuestionNumber());
        this.numberOfQuestionGood = 0;
        this.setLanguage(topo.Kaart.Language);
        this.setNiveau(topo.Kaart.Niveau);
        this.setAnswerType(topo.Kaart.AnswerType);
        this.setLanguagePlaats();
        this.setScore(0);
        this.setNumberOfQuestionDone(0);
        this.gotoNextQuestion();
        topo.showModule('Question')
    }
    //binding
    $('#cboLanguage').change(function (e) {
        topo.Kaart.Language = $(this).val();
        topo.game.save();
        topo.SayPlaats(_this.getCorrectAnswer(), $(this).val());
    });
    $('#cboNiveau').change(function (e) {
        _this.setNiveau($(this).val());
        _this.resetScoreAndMap();
        _this.setNumberOfQuestion(_this.getMaxQuestionNumber());
        _this.setQuestionNumber();
    });

    $('#radAnswerType input').change(function (e) {
        _this.setAnswerType($(this).val());
    });

    $('#btnNextQuestion').click(function () {
        _this.gotoNextQuestion();
    });
    $('#btnRestart').click(function (e) {
        _this.resetScoreAndMap();
    });
    $('#btnOwnSelection').click(function (e) {
        topo.showModule('SelectionModule');
    });

    $('#btnAanpassen').click(function (e) {
        topo.showModule('EditModule');
    });
    $('area').click(function (e) {
        if (!_this.Finished && this.alt && this.alt.split(':').length >= 3)
            _this.validate(this.alt.split(':')[2]);
        if (_this.numberOfQuestionDone == _this.numberOfQuestion) {
            topo.showModule("ResultModule");
            _this.Finished = true;
        }
        return false;

    });
    //this.fixShapeAtrrubute();
    this.resetScoreAndMap();
};
topo.ResultModule = function () {
    this.createResultTable = function () {//TODO sort eerst fout en dan op label, Button back toevoegen, plaatsen in een max height div met hoogte van img
        var x = 0;
        var index = 0;
        var rows = [];
        $("#map area").each(function () {
            var status = this.attributes['status'];
            if (this.alt && this.alt.split(':').length >= 3 && (status === true || status === false)) {
                var naam = this.alt.split(':')[2];
                var row = ["<div class='row hover' index='" + index + "' naam='" + naam + "'><div class='col-sm-1 ", status, "'areaIndex='", index, "'>&nbsp;</div><div class='col-sm-11'>", naam, "</div></div>"].join('');
                rows[x++] = row;
            }
            index++;
        });
        $('#ResultTable').html(rows.join(''));
        ////set y-scroll  //todo image mee laten scrollen en dit verwijderen
        //$('#ResultTable').css('height', $('canvas').attr('height') + 'px')
        //$('#ResultTable').css('overflow-y', 'auto');
        //$('#ResultTable').css('overflow-x', 'hidden');
        //bind the events
        $('#ResultTable div.row').mouseover(function (e) {
            var row = $(this);
            $('.canvas-area[data-image-url]')[0].Highlight(row[0].attributes['index'].value, row[0].attributes['naam'].value);
        });
        $('#ResultTable div.row').mouseout(function (e) {
            var row = $(this);
            $('.canvas-area[data-image-url]')[0].clean();
        });
    }
    //Binding van buttons die er al zijn
    $('#btnResultTerug').click(function (e) {
        topo.showModule('QuestionModule');
    });

}
topo.SelectionModule = function () {
    var _this = this;
    this.getOwnSelection = function () {
        return topo.Kaart.Selected;
    }
    this.setOwnSelection = function (value) {
        topo.Kaart.Selected = value;
        topo.game.save();
    }

    this.createSelection = function () {
        var x = 0;
        var index = 0;
        var rows = [];
        var selected = this.getOwnSelection();
        $("#map area").each(function () {
            if (this.alt && this.alt.split(':').length >= 3) {
                var niveau = this.alt.split(':')[0];
                var label = this.alt.split(':')[1];
                var naam = this.alt.split(':')[2];
                var checked = (selected && selected[label]) ? "checked" : "";
                var row = ["<div class='checkbox' index='" + index + "' naam='" + naam + "' ><label>", label, "</label>&nbsp;<label><input type='checkbox' ", checked, " value=", label, ">", naam, "</label></div>"].join('');
                rows[x++] = row;
            }
            index++;
        });
        //bind the events
        $('#SelectionTable').html(rows.join(''));
        $('#SelectionTable').change(function (e) {
            var selected = {};
            $('#SelectionTable input').each(function () {
                selected[this.value] = this.checked;
            });
            _this.setOwnSelection(selected);
        });

        $('#SelectionTable div.checkbox').mouseover(function (e) {
            $('.canvas-area[data-image-url]')[0].Highlight(this.attributes['index'].value, this.attributes['naam'].value);
        });
        $('#SelectionTable div.checkbox').mouseout(function (e) {
            $('.canvas-area[data-image-url]')[0].clean();
        });
        ////set y-scroll  //todo image mee laten scrollen en dit verwijderen

        //$('#SelectionTable').css('overflow-y', 'auto');
        //$('#SelectionTable').css('overflow-x', 'hidden');
    }
    $('#btnSelectionTerug').click(function (e) {
        topo.question.setNiveau("D");
        topo.question.resetScoreAndMap();
        topo.showModule('QuestionModule');
    });
}
topo.EditModule = function () {
    var _this = this;

    this.createEditableTable = function () {
        var x = 0;
        var _this = this;
        var index = 0;
        var rows = [];
        var SelectedIndex = 0;
        $("#map area").each(function () {
            if (this.alt && this.alt.split(':').length >= 3) {
                var niveau = this.alt.split(':')[0];
                var label = this.alt.split(':')[1];
                var naam = this.alt.split(':')[2];
                var lang = (this.alt.split(':').length > 3) ? this.alt.split(':')[3] : "";
                var optionsDef = '<option value=""></option><option value="ar">Arabic</option><option value="zh-CN">Mandarin (simplified)</option><option value="zh-TW">Mandarin (traditional)</option><option value="cs">Czech</option><option value="da">Danish</option><option value="nl">Dutch</option><option value="en">English</option><option value="fi">Finnish</option><option value="fr">French</option><option value="de">German</option><option value="el">Greek</option><option value="ht">Haitian Creole</option><option value="hi">Hindi</option><option value="hu">Hungarian</option><option value="id">Indonesian</option><option value="it">Italian</option><option value="ja">Japanese</option><option value="ko">Korean</option><option value="la">Latin</option><option value="no">Norwegian</option><option value="pl">Polish</option><option value="pt">Portuguese</option><option value="ru">Russian</option><option value="sk">Slovak</option><option value="es">Spanish</option><option value="sv">Swedish</option><option value="th">Thai</option><option value="tr">Turkish</option>'
                var options = optionsDef.replace('"' + lang + '"', '"' + lang + '" selected')
                var row = ["<div class='row ' areaIndex='", index, "'>"
                        + "<div class='col-md-1'><span class='glyphicon glyphicon-volume-up' aria-hidden='true'/><span class='glyphicon glyphicon-remove' aria-hidden='true'/></div>"
                        + "<div class='col-md-1'><input class='form-control' type=text field='niveau' value='", niveau, "'/></div>"
                        + "<div class='col-md-1'><input class='form-control' type=text field='label' value='", label, "'/></div>"
                        //+ "<input class='col-md-1' type=text field='lang' value='", lang, "'/>"
                        + '<div class="col-md-4"><select class="form-control chosen-select" >' + options + '</select></div>'
                        + "<div class='col-md-5'><input class='form-control' type=text field='naam' value='", naam, "'/></div>"
                        + "</div>"].join('');
                rows[x++] = row;
            }
            index++;
        });
        $('#EditableTable').html(rows.join(''));
        //binding
        $('#EditableTable input,#EditableTable select').focus(function (e) {
            var row = $(this).parent().parent();
            var index = $(row)[0].attributes['areaIndex'].value;
            SelectedIndex = index;

            $('.canvas-area[data-image-url]')[0].SaveArea();
            $('.canvas-area[data-image-url]')[0].ShowArea(index);
        });
        $('#EditableTable input').blur(function (e) {
            var row = $(this).parent().parent();
            var index = $(row)[0].attributes['areaIndex'].value;
            var niveau = row.children()[1].value;
            var label = row.children()[2].value;
            var lang = row.children()[3].value;
            var plaats = row.children()[4].value;
            $('area')[index].attributes['alt'].value = niveau + ':' + label + ':' + plaats + ':' + lang;
            $('area')[index].attributes['title'] = label;
            $('.canvas-area[data-image-url]')[0].clean();
        });
        $('.glyphicon-volume-up').click(function () {
            var row = $(this).parent().parent();
            var lang = row.children()[3].value;
            var plaats = row.children()[4].value;
            topo.SayPlaats(plaats, lang);
        });
        $('.glyphicon-remove').click(function () {
            var row = $(this).parent().parent();
            var index = $(row)[0].attributes['areaIndex'].value;
            $('map area')[index].remove();
            _this.createEditableTable();
        });
        $("#EditableTable .chosen-select").chosen();

    }
    //Binding
    $('#btnEditTerug').click(function (e) {
        topo.showModule('QuestionModule');
    });
    $('#btnSave').click(function (e) {
        var map = $('map')[0].outerHTML;
        $.ajax({
            type: "POST",
            data: JSON.stringify({ Map: map }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                alert(response);
                window.location.reload();
            }
        });
    });
    $('#btnNew').click(function (e) {
        var newIndex = $("#map area").length;
        $("#map").append("<area shape='rect' alt='C:" + newIndex + ":" + newIndex + "' title='" + newIndex + "' coords='' href=''/>")
        _this.createEditableTable();
    });
}

topo.game = new topo.Game(window.KaartID);
topo.question = new topo.Question();
topo.result = new topo.ResultModule();
topo.selectionModule = new topo.SelectionModule();
topo.editModule = new topo.EditModule();

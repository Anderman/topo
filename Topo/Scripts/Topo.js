

$(function () {
    var topo = new Topo();
});

function Topo() {
    var _topo = this;

    this.getPlayers = function () {
        var cookie = $.cookie("players");
        var players = cookie ? JSON.parse($.cookie("players")) : {};
        return players;
    };
    this.setPlayers = function (players) {
        $.cookie("players", JSON.stringify(players), { expires: 365 });
    };

    this.getOwnSelection = function () {
        var cookie = $.cookie("Kaart" + KaartID);
        var selected = cookie ? JSON.parse($.cookie("Kaart" + KaartID)) : null;
        return selected;
    };
    this.setOwnSelection = function (selected) {
        $.cookie("Kaart" + KaartID, JSON.stringify(selected), { expires: 365 });
    };
    this.showModule = function (module) {
        switch (module) {
            case 'QuestionModule': {
                $(".EditModule").hide();
                $(".ResultModule").hide();
                $(".QuestionModule").show();
                $(".SelectionModule").hide();
                break;
            }
            case 'EditModule': {
                this.EditModule.createEditableTable();

                $(".EditModule").show();
                $(".ResultModule").hide();
                $(".QuestionModule").hide();
                $(".SelectionModule").hide();
                break;
            }
            case 'ResultModule': {
                $(".EditModule").hide();
                $(".ResultModule").show();
                $(".QuestionModule").hide();
                $(".SelectionModule").hide();
                break;

            }
            case 'SelectionModule': {
                this.SelectionModule.createSelection();
                $(".EditModule").hide();
                $(".ResultModule").hide();
                $(".QuestionModule").hide();
                $(".SelectionModule").show();
                break;
            }
        }
    }
    function Question() {
        var _this = this;
        this.questionType = '';

        //Question Module
        //Display Values
        this.setLanguage = function (value) {
            this.language = value;
            $("#cboLanguage").val(value);
        }
        this.setNiveau = function (value) {
            this.niveau = value;
            $("#cboNiveau").val(value);
        }
        this.setAnswerType = function (value) {
            this.answerType = value;
            if (value == 'Type') {
                $('#TypeQuestion').show();
                $('#ClickQuestion').hide();
            }
            else {
                $('#ClickQuestion').show();
                $('#TypeQuestion').hide();
            }
            $('#radAnswerType input[name="AnswerResponse"][value="' + value + '"]').prop('checked', true);
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
        this.setQuestion = function (value) {
            _this.question = value;
            $('#txtQuestion').html(value);
            var audio = new Audio('/TTS/index?q=' + value + '&tl=' + _this.languagePlaats);
            audio.play();

        }
        this.setQuestionNumber = function () {
            var x = 0;
            $("#map area").each(function () {
                if (this.alt && this.alt.split(':').length >= 3 && (this.attributes['status'] === true || this.attributes['status'] === false) || this.attributes['current']) {
                    x++;
                }
            });
            $("#txtQuestionNumber").html((x) + ' (van ' + _this.getMaxQuestionNumber() + ')');
        }

        //Get Values
        this.getCorrectAnswer = function () {
            return _this.question;
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
                if (_this.isSelected(_this.niveau, this.alt, _topo.getOwnSelection())) {
                    x = x + 1;
                };
            });
            return x;
        }
        //Logica
        this.gotoNextQuestion = function () {
            var max = _this.getMaxQuestionNumber();
            var done = _this.numberOfQuestionDone;
            var nextQuestionNumber = Math.floor(Math.random() * (max - done));
            console.debug('random=' + nextQuestionNumber + ' done=' + done + ' max=' + max);
            var x = 0;
            $("#map area").each(function (index) {
                if (_this.isSelected(_this.niveau, this.alt, _topo.getOwnSelection()) && !this.attributes['done']) {
                    if (x == nextQuestionNumber) {
                        _this.languagePlaats = this.alt.split(':').length > 3 ? this.alt.split(':')[3] : _this.language;
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
            if (_this.numberOfQuestionDone < _this.numberOfQuestion) {
                if (_this.answerType == 'Click' && answer == _this.getCorrectAnswer()) {
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
            }
            if (_this.numberOfQuestionDone == _this.numberOfQuestion) {
                _topo.ResultModule.showResult();
            }
        };
        //Init
        this.resetScoreAndMap = function () {
            $("#map area").each(function () {
                delete this.attributes['status']
                delete this.attributes['current']
                delete this.attributes['done']
            });
            this.numberOfQuestionGood = 0;
            this.setScore(0);
            this.setNumberOfQuestionDone(0);
            this.gotoNextQuestion();
            _topo.showModule('Question')
        }
        this.setAnswerType("Click");
        this.setLanguage($.cookie("lang") || "en");
        this.setNiveau('A');
        this.setNumberOfQuestion(this.getMaxQuestionNumber());
        this.resetScoreAndMap();
        //binding
        $('#cboLanguage').change(function (e) {
            _this.language = $(this).val();
            $.cookie("lang", _this.language);
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
            _topo.showModule('SelectionModule');
        });

        $('#btnEnd').click(function (e) {
            alert('btnEnd');
        });
        $('#btnAanpassen').click(function (e) {
            _topo.showModule('EditModule');
        });
        $('#btnOefenen').click(function (e) {
            _topo.showModule('QuestionModule');
        });
        $('#btnResultOefenen').click(function (e) {
            _topo.showModule('QuestionModule');
        });
        $('area').click(function (e) {
            if (this.alt && this.alt.split(':').length >= 3)
                _this.validate(this.alt.split(':')[2]);
            return false;
        });
    };

    function SelectionModule() {
        _this = this;
        this.createSelection = function () {
            var x = 0;
            var rows = [];
            var selected = _topo.getOwnSelection();
            $("#map area").each(function () {
                if (this.alt && this.alt.split(':').length >= 3) {
                    var niveau = this.alt.split(':')[0];
                    var label = this.alt.split(':')[1];
                    var naam = this.alt.split(':')[2];
                    var checked = (selected && selected[label]) ? "checked" : "";
                    var row = ["<div class='checkbox'><label><input type='checkbox' ", checked, " value=", label, "> ", naam, "</label></div>"].join('');
                    rows[x++] = row;
                }
            });
            $('#SelectionTable').html(rows.join(''));
            $('#SelectionTable').change(function (e) {
                var selected = {};
                $('#SelectionTable input').each(function () {
                    selected[this.value] = this.checked;
                });
                _topo.setOwnSelection(selected);
            });
            $('#btnSelectionSave').click(function (e) {
            });

        }
    }
    function ResultModule() {

        //Edit module
        //display values
        this.showResult = function () {
            var x = 0;
            var index = 0;
            var rows = [];
            $("#map area").each(function () {
                var status = this.attributes['status'];
                if (this.alt && this.alt.split(':').length >= 3 && (status === true || status === false)) {
                    var naam = this.alt.split(':')[2];
                    var row = ["<div class='row hover'><div class='col-sm-12 ", status, "'areaIndex='", index, "'>", naam, "</div></div>"].join('');
                    rows[x++] = row;
                }
                index++;
            });
            $('#ResultTable').html(rows.join(''));
            _topo.showModule("ResultModule");
        }
    }
    function EditModule() {
        _this = this;


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
                    var row = ["<div class='row hover' areaIndex='", index, "'>"
                            + "<input class='col-sm-1' type=text field='niveau' value='", niveau, "'>"
                            + "<input class='col-sm-1' type=text field='label' value='", label, "'>"
                            + "<input class='col-sm-2' type=text field='lang' value=\"", lang, "\">"
                            + "<input class='col-sm-10' type=text field='naam' value=\"", naam, "\">"
                            + "</div>"].join('');
                    rows[x++] = row;
                }
                index++;
            });
            $('#EditableTable').html(rows.join(''));
            $('#EditableTable input').focus(function (e) {
                var row = $(this).parent();
                var index = $(row)[0].attributes['areaIndex'].value;
                SelectedIndex = index;

                $('.canvas-area[data-image-url]')[0].SaveArea();
                $('.canvas-area[data-image-url]')[0].ShowArea(index);
            });
            $('#EditableTable input').blur(function (e) {
                var row = $(this).parent();
                var index = $(row)[0].attributes['areaIndex'].value;
                var niveau = row.children()[0].value;
                var label = row.children()[1].value;
                var lang = row.children()[2].value;
                var plaats = row.children()[3].value;
                $('area')[index].attributes['alt'].value = niveau + ':' + label + ':' + plaats + ':' + lang;
                $('area')[index].attributes['title'] = label;
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
        //Binding
    }


    this.ResultModule = new ResultModule();
    this.SelectionModule = new SelectionModule();
    this.EditModule = new EditModule();
    this.question = new Question();

}

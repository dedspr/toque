$(function () {

    $.localDB = {
        init: function (func, param) {
            this.initDatabase(func, param);
        },

        initDatabase: function (func, param) {
            try {
                if (!window.openDatabase) {
                    alert('Local Databases are not supported by your browser');
                } else {
                    var shortName = 'DB',
                        version = '1.0',
                        displayName = 'DB App',
                        maxSize = 100000;

                    DB = openDatabase(shortName, version, displayName, maxSize);
                    this.createTables();

                    if (func == "selectCountAvaliacao")
                        this.selectCountAvaliacao(param);
                    else if (func == "selectAvaliacao")
                        this.selectAvaliacao();
                    else if (func == "selectAgenda")
                        this.selectAgenda();
                }
            } catch (e) {
                if (e === 2) {
                    // Version mismatch.
                    console.log("Invalid database version.");
                } else {
                    console.log("Unknown error " + e + ".");
                }
                return;
            }
        },

		/***
		**** CREATE TABLE ** 
		***/
        createTables: function () {
            var that = this;
            DB.transaction(
                function (transaction) {
                    transaction.executeSql('CREATE TABLE IF NOT EXISTS avaliacao (data, mao_esquerda, metodo_exercicios, foco_distracao, auto_confianca, tempo_dedicado, estudo, arco, repertorio);', [], that.nullDataHandler, that.errorHandler);
                    transaction.executeSql('CREATE TABLE IF NOT EXISTS evento (id integer primary key autoincrement, data, hora, tipo, descricao);', [], that.nullDataHandler, that.errorHandler);
                    transaction.executeSql('CREATE TABLE IF NOT EXISTS valido (id integer primary key autoincrement, stvalido);', [], that.nullDataHandler, that.errorHandler);
                }
            );

        },

		/***
		**** INSERT INTO TABLE ** 
		***/
        salvarAvaliacao: function () {
            DB.transaction(
                function (transaction) {

                    var model = {
                        mao_esquerda: $("#mao_esquerda").val(),
                        metodo_exercicios: $("#metodo_exercicios").val(),
                        foco_distracao: $("#foco_distracao").val(),
                        auto_confianca: $("#auto_confianca").val(),
                        tempo_dedicado: $("#tempo_dedicado").val(),
                        estudo: $("#estudo").val(),
                        arco: $("#arco").val(),
                        repertorio: $("#repertorio").val(),
                    };

                    transaction.executeSql("INSERT INTO avaliacao(data, mao_esquerda, metodo_exercicios, foco_distracao, auto_confianca, tempo_dedicado, estudo, arco, repertorio) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        [(new Date()), model.mao_esquerda, model.metodo_exercicios, model.foco_distracao, model.auto_confianca, model.tempo_dedicado, model.estudo, model.arco, model.repertorio]);

                    window.location.href = "mapa.html";
                }
            );
        },

        salvarEvento: function () {
            DB.transaction(
                function (transaction) {

                    var model = {
                        data: $("#data").val(),
                        hora: $("#hora").val(),
                        tipo: $("#tipo").val(),
                        descricao: $("#descricao").val(),
                    };

                    transaction.executeSql("INSERT INTO evento(data, hora, tipo, descricao) VALUES (?, ?, ?, ?)",
                        [model.data, model.hora, model.tipo, model.descricao]);

                    document.addEventListener('deviceready', function () {
                        
                        var data = new Date();

                        var from = model.data.split("/");
                        var hour = model.hora.split(":");
                        
                        data.setDate(from[2], (from[1]), from[0]);
alert(1);
                        data.setHours(hour[0]);
                        alert(2);
                        data.setMinutes(hour[1]);
                        alert(3);
                        data.setSeconds(0);
                        var dtalarm = new Date(data);
                        alert(dtalarm);
                        cordova.plugins.notification.local.schedule({
                            title: 'Agenda - Toque Violino Fácil',
                            text: (model.tipo == 'Descricao') ? model.descricao : model.tipo,
                            icon: "file://img/icon.png",
                            smallIcon: "file://img/icon.png",
                            sound: device.platform != 'iOS' ? 'file://beep.mp3' : 'file://beep.caf',
                            firstAt: dtalarm,
                            every: "day"
                        });
alert(4);
                    }, false);

                    window.location.href = "agenda.html";
                }
            );
        },

        selectAvaliacao: function () {
            var that = this;

            DB.transaction(
                function (transaction) {
                    transaction.executeSql("SELECT * FROM avaliacao ORDER BY data DESC;", [], that.dataSelectAvaliacao, that.errorHandler);

                }
            );
        },

        dataSelectAvaliacao: function (transaction, results) {
            if (results.rows.length > 0) {

                // Handle the results
                var i = 0, row;

                window.chartColors = {
                    red: 'rgb(255, 99, 132)',
                    orange: 'rgb(255, 159, 64)',
                    yellow: 'rgb(255, 205, 86)',
                    green: 'rgb(75, 192, 192)',
                    blue: 'rgb(54, 162, 235)',
                    purple: 'rgb(153, 102, 255)',
                    grey: 'rgb(201, 203, 207)'
                };

                var color = Chart.helpers.color;

                for (i; i < results.rows.length; i++) {
                    row = results.rows.item(i);
                    var data = new Date(row['data']);
                    var config = {
                        type: 'radar',
                        data: {
                            labels: ["Mão esquerda", "Método/Exercícios", "Foco/Distração", "Auto Confianca", "Tempo Dedicado", "Estudo", "Arco", "Repertório"],
                            datasets: [{
                                label: pad(data.getDate().toString(), 2) + "/" + pad((data.getMonth() + 1), 2) + "/" + data.getFullYear(),
                                backgroundColor: color(window.chartColors.red).alpha(0.2).rgbString(),
                                borderColor: "#ff0000",
                                pointBackgroundColor: window.chartColors.red,
                                data: [
                                    parseInt(row['mao_esquerda']),
                                    parseInt(row['metodo_exercicios']),
                                    parseInt(row['foco_distracao']),
                                    parseInt(row['auto_confianca']),
                                    parseInt(row['tempo_dedicado']),
                                    parseInt(row['estudo']),
                                    parseInt(row['arco']),
                                    parseInt(row['repertorio'])
                                ]
                            }]
                        },
                        options: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: false,
                                text: 'Mapa'
                            },
                            scale: {
                                ticks: {
                                    beginAtZero: true
                                }
                            },
                        },

                        responsive: true,
                    };

                    window.myRadar = new Chart(document.getElementById("canvas"), config);
                    $("#linkAvaliacao").hide();

                    var dataAtual = new Date();
                    var previsao = dataAtual.setDate(data.getDate() + 30);

                    if (dataAtual > previsao) {
                        $("#linkFazerAvaliacao").show();
                        $("#btnAvaliacao").show();
                    }
                    else {
                        $("#linkFazerAvaliacao").hide();
                        $("#btnAvaliacao").hide();
                    }

                    break;

                }
            }
            else {
                $("#canvas").hide();
                $("#linkAvaliacao").show();
                $("#linkFazerAvaliacao").hide();
            }
        },

        selectCountAvaliacao: function (page) {
            var that = this;
            DB.transaction(
                function (transaction) {
                    transaction.executeSql("SELECT mao_esquerda, metodo_exercicios, foco_distracao, auto_confianca, tempo_dedicado, estudo, arco, repertorio FROM avaliacao ORDER BY data DESC;", [],
                        that.dataSelectHomeAvaliacao,
                        that.errorHandler);

                }
            );
        },

        dataSelectHomeAvaliacao: function (transaction, results) {

            $("#linkAvaliacao").hide();
            $("#linkTreinoAvaliacao").hide();

            if (results.rows.length > 0) {
                row = results.rows.item(0);

                var min = Math.min.apply(null, Object.keys(row).map(function (x) { return row[x] }));
                menorAvaliacao = Object.keys(row).filter(function (x) { return row[x] == min; })[0];

                //, metodo_exercicios, foco_distracao, auto_confianca, tempo_dedicado, estudo, arco, repertorio
                switch (menorAvaliacao) {
                    case 'mao_esquerda':
                        menorAvaliacao = "Mão esquerda";
                        break;
                    case 'metodo_exercicios':
                        menorAvaliacao = "Métodos/Exercícios";
                        break;
                    case 'foco_distracao':
                        menorAvaliacao = "Foco/Distração";
                        break;
                    case 'auto_confianca':
                        menorAvaliacao = "Auto confiança";
                        break;
                    case 'tempo_dedicado':
                        damenorAvaliacaoy = "Tempo dedicado";
                        break;
                    case 'estudo':
                        menorAvaliacao = "Estudo";
                        break;
                    case 'arco':
                        menorAvaliacao = "Arco";
                        break;
                    case 'repertorio':
                        menorAvaliacao = "Repertório";
                }

                $("#linkTreinoAvaliacao").html("Sua nota esta baixa em <b>" + menorAvaliacao + "</b><br>Clique aqui para agendar seu treino");
                $("#linkTreinoAvaliacao").show();
            }
            else {
                $("#linkAvaliacao").show();
            }
        },

        selectAgenda: function () {
            var that = this;

            DB.transaction(
                function (transaction) {
                    transaction.executeSql("SELECT * FROM evento;", [], that.dataSelectAgenda, that.errorHandler);

                }
            );
        },

        dataSelectAgenda: function (transaction, results) {
            var eventos = []

            for (var i = 0; i < results.rows.length; i++) {
                row = results.rows.item(i);

                var data = new Date(row['data']);

                eventos.push({
                    id: row['id'],
                    title: (row['tipo'] == 'Outros') ? row['descricao'] : row['tipo'],
                    start: (data.getFullYear() + "-" + pad((data.getMonth() + 1), 2) + "-" + pad(data.getDate().toString(), 2)) + 'T' + row['hora'] + ':00'
                });
            }

            $('#calendar').fullCalendar({

                header: {
                    left: '',
                    center: 'title',
                    right: ''
                },
                footer: {
                    left: 'prev,next today',
                    center: '',
                    right: 'month,basicWeek,basicDay'
                },

                theme: true,
                themeSystem: 'bootstrap3',
                dayClick: function (date, jsEvent, view) {
                    var res = date.format().toString().split("-");
                    window.location.href = "evento.html?day=" + res[2] + "&month=" + res[1] + "&year=" + res[0];
                },
                defaultDate: new Date().toISOString().slice(0, 10),
                editable: true,
                locale: 'pt-br',
                eventLimit: true, // allow "more" link when too many events
                events: eventos
            });
        },

        selectValido: function () {
            var that = this;

            DB.transaction(
                function (transaction) {
                    transaction.executeSql("SELECT * FROM valido where stvalido = 'S';", [], that.dataSelectValido, that.errorHandler);

                }
            );
        },

        dataSelectValido: function (transaction, results) {

            var strData = "21/11/2017";
            var partesData = strData.split("/");
            var data = new Date(partesData[2], partesData[1] - 1, partesData[0]);
            if (data < new Date()) {
                window.location.href = "expirou.html";
            }
        },

        salvarValido: function () {
            DB.transaction(
                function (transaction) {

                    transaction.executeSql("INSERT INTO valido(stvalido) VALUES (?)",
                        ['S']);

                    window.location.href = "index.html";
                }
            );
        },

        errorHandler: function (transaction, error) {

            if (error.code === 1) {
                // DB Table already exists
            } else {
                // Error is a human-readable string.
                console.log('Oops.  Error was ' + error.message + ' (Code ' + error.code + ')');
            }
            return false;
        },

        nullDataHandler: function () {
            //console.log("SQL Query Succeeded");
        },

    };

});

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}
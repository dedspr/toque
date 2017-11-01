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
                        mao_esquerda: $("input[name=mao_esquerda]:checked").val(),
                        metodo_exercicios: $("input[name=metodo_exercicios]:checked").val(),
                        foco_distracao: $("input[name=foco_distracao]:checked").val(),
                        auto_confianca: $("input[name=auto_confianca]:checked").val(),
                        tempo_dedicado: $("input[name=tempo_dedicado]:checked").val(),
                        estudo: $("input[name=estudo]:checked").val(),
                        arco: $("input[name=arco]:checked").val(),
                        repertorio: $("input[name=repertorio]:checked").val(),
                    };

                    transaction.executeSql("INSERT INTO avaliacao(data, mao_esquerda, metodo_exercicios, foco_distracao, auto_confianca, tempo_dedicado, estudo, arco, repertorio) "+
                                           "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                        [(new Date()), model.mao_esquerda, model.metodo_exercicios, model.foco_distracao, model.auto_confianca, model.tempo_dedicado, model.estudo, model.arco, model.repertorio]);

                    window.location.href = "mapa.html";
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
            // Handle the results
            var i = 0,
                row;

            for (i; i < results.rows.length; i++) {
                row = results.rows.item(i);
                
            }
        },
        
        selectCountAvaliacao: function (page) {
            var that = this;
            DB.transaction(
                function (transaction) {
                    transaction.executeSql("SELECT * FROM avaliacao ORDER BY data DESC;", [], 
                                           ((page == "home") ? that.dataSelectHomeAvaliacao : that.dataSelectCountAvaliacao), 
                                           that.errorHandler);

                }
            );
        },

        dataSelectHomeAvaliacao: function (transaction, results) {
            
            $("#linkAvaliacao").hide();
            $("#linkTreinoAvaliacao").hide();
            
            if (results.rows.length > 0) {
                row = results.rows.item(0);
                
                menorAvaliacao = Object.keys(row).sort(function(a,b){return list[a]-list[b]})
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
                
                $("#linkTreinoAvaliacao").html("Notamos que sua nota em <i color='color: red;'>"+menorAvaliacao+"</i> esta baixa<br>Clique aqui para treinar");
                $("#linkTreinoAvaliacao").show();
            }
            else {
                $("#linkAvaliacao").show();
            }
        },
                
        dataSelectCountAvaliacao: function (transaction, results) {
            if (results.rows.length > 0) {
                row = results.rows.item(0);
                
            }
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
            console.log("SQL Query Succeeded");
        },

    };

});	
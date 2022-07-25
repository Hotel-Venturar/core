let conn = require('./db');
let formidable = require('formidable');
let path = require('path');
let Pagination = require('./Pagination');
let moment = require('moment');

module.exports = (io) => {
    return {

        login(req) {

            return new Promise((s, f) => {

                conn.query(
                    `
                    SELECT * FROM tb_usuarios WHERE email = ?
                `,
                    [
                        req.body.email
                    ],
                    (err, results) => {

                        if (err) {
                            f(err);
                        } else if (results.length === 0) {
                            f('Usuário e/ou senha incorretos.');
                        } else if (results[0].senha !== req.body.senha) {
                            f('Usuário e/ou senha incorretos.');
                        } else {

                            let user = results[0];

                            req.session.user = user;

                            s(user);

                        }

                    }
                );

            });

        },
        home() {

            return new Promise((s, f) => {

                conn.query(
                    `
                    SELECT
                        (SELECT COUNT(*) FROM tb_contatos) AS nrcontacts,
                        (SELECT COUNT(*) FROM tb_quartos) AS nrquartos,
                        (SELECT COUNT(*) FROM tb_reservas) AS nrreservations,
                        (SELECT COUNT(*) FROM tb_usuarios) AS nrusers
                `,
                    (err, results) => {

                        if (err) {

                            f(err);

                        } else {

                            s(results[0]);

                        }

                    }
                );

            });

        },
        quartos() {

            return new Promise((s, f) => {

                conn.query(
                    `
                    SELECT * FROM tb_quartos ORDER BY id_quarto
                `,
                    (err, results) => {

                        if (err) {
                            f(err);
                        } else {
                            s(results);
                        }

                    }
                );

            });

        },
        quartosSave(req) {

            return new Promise((s, f) => {
        
                let form = new formidable.IncomingForm({
                    uploadDir: path.join(__dirname, `../public/images`),
                    keepExtensions: true
                });
        
                form.parse(req, function (err, fields, files) {

                    if (err) {
                        f(err);
                    } else {
        
                        if (!files.foto) {
        
                            f('A foto não foi enviada!');
        
                        } else {
        
                            fields.foto = 'images/' + path.parse(files.foto.filepath).base;

                            let query, queryFoto = '' , params = [
                                fields.nome_quarto,
                                fields.descricao,
                                fields.tarifa,
                            ]; 

                            if (parseInt(fields.id_quarto) > 0) {
                                
                                if (fields.foto.includes('.')) {
                                    queryFoto = ', foto = ?';
                                    params.push(fields.foto);
                                }

                                params.push(fields.id_quarto);

                                query = `
                                UPDATE tb_quartos
                                SET nome_quarto = ?, descricao = ?, tarifa = ? ${queryFoto}
                                WHERE id_quarto = ?
                            `;

                            } else {
                                params.push(fields.foto);

                                console.log("passei aqui insert");    
                                query = `
                                INSERT INTO tb_quartos (nome_quarto, descricao, tarifa, foto)
                                VALUES(?, ?, ?, ?)
                                `;
                                
                            }

                            conn.query(query, params, (err, results) => {

                                if (err) {
                                    f(err);
                                } else {

                                    io.emit('reservations update', fields);

                                    s(fields, results);

                                }
                            })
                        }
                    }
                });
            });
        },
        quartosDelete(req) {

            return new Promise((s, r) => {

                if (!req.params.id) {
                    f('Informe o ID.');
                } else {

                    conn.query(`
                    DELETE FROM tb_quartos WHERE id_quarto = ?
                `, [
                            req.params.id
                        ], (err, results) => {

                            if (err) {
                                f(err);
                            } else {
                                io.emit('reservations update');
                                s(results);
                            }

                        });

                }

            });

        },
        reservasSave(req) {

            return new Promise((s, f) => {

                let form = new formidable.IncomingForm();

                form.parse(req, function (err, fields, files) {
                    console.log(fields)
                    
                    let query, params;

                    if (parseInt(fields.id_reserva) > 0) {

                        query = `
                                UPDATE tb_reservas
                                SET nome = ?, email = ?, qt_hospedes = ?, data_inicio = ?, data_fim = ?, fk_id_quarto = ?, status_reserva = ? 
                                WHERE id_reserva = ?
                            `;
                        params = [
                            fields.nome,
                            fields.email,
                            fields.qt_hospedes,
                            fields.data_inicio,
                            fields.data_fim,
                            parseInt(fields.fk_id_quarto),
                            fields.status_reserva,
                            fields.id_reserva
                        ];


                    } else {

                        query = `
                                INSERT INTO tb_reservas (nome, email, qt_hospedes, data_inicio, data_fim, fk_id_quarto, status_reserva )
                                VALUES(?, ?, ?, ?, ?, ?)
                            `;
                        params = [
                            fields.nome,
                            fields.email,
                            fields.qt_hospedes,
                            fields.data_inicio,
                            fields.data_fim,
                            parseInt(fields.fk_id_quarto),
                            fields.status_reserva
                        ];

                    }

                    conn.query(query, params, (err, results) => {

                        if (err) {
                            f(err);
                        } else {

                            io.emit('reservations update', fields);

                            s(fields, results);

                        }

                    }
                    );

                });

            });

        },
        alterarStatus(req) {

            return new Promise((s, f) => {

                let form = new formidable.IncomingForm();

                form.parse(req, function (err, fields, files) {
                    
                    let query, params;

                        query = `
                                UPDATE tb_reservas
                                SET status_reserva = ? 
                                WHERE id_reserva = ?
                            `;
                        params = [
                            fields.status_reserva,
                            fields.id_reserva
                        ];

                    conn.query(query, params, (err, results) => {

                        if (err) {
                            f(err);
                        } else {

                            io.emit('reservations update', fields);

                            s(fields, results);

                        }

                    }
                    );

                });

            });

        },
        reservas(params) {

            return new Promise((s, f) => {

                
                
                let pag = new Pagination(
                    "SELECT SQL_CALC_FOUND_ROWS * FROM tb_reservas JOIN tb_quartos q on q.id_quarto = fk_id_quarto WHERE data_inicio BETWEEN ? AND ? ORDER BY nome LIMIT ?, ?",
                    [
                        params.start,
                        params.end
                    ]
                );

                pag.getPage(params.page).then(data => {
                    this.quartos().then((quartos) => {
                        s({
                            data,
                            quartos,
                            total: pag.getTotal(),
                            current: pag.getCurrentPage(),
                            pages: pag.getTotalPages(),
                            nav: pag.getNavigation(params)
                        });
                    })

                   

                }).catch(err => {

                    f(f);

                });

            });

        },
        reservasChart(params) {



            return new Promise((s, f) => {

                conn.query(`
                SELECT CONCAT(YEAR(data_inicio), '-',MONTH(data_inicio)) AS date, COUNT(*) AS total, 
                SUM(qt_hospedes) / COUNT(*) AS avg_people, tq.id_quarto as id, tq.nome_quarto as nome
                FROM tb_reservas
                JOIN tb_quartos tq
                WHERE data_inicio BETWEEN ? AND ?
                GROUP BY YEAR(data_inicio), MONTH(data_inicio), data_inicio, nome, id 
                ORDER BY YEAR(data_inicio), MONTH(data_inicio)
            `, [
                        params.start,
                        params.end
                    ], (err, results) => {

                        if (err) {
                            f(err);
                        } else {

                            let months = [];
                            let values = [];

                            results.forEach(row => {

                                months.push(moment(row.date).format('MMM YYYY'));
                                values.push(row.total);

                            });

                            s({
                                months,
                                values
                            });

                        }

                    });

            });

        },
        reservasDelete(req) {

            return new Promise((s, r) => {

                console.log(req.params.id);

                if (!req.params.id) {
                    f('Informe o ID.');
                } else {

                    conn.query(`
                    DELETE FROM tb_reservas WHERE id_reserva = ?
                `, [
                            req.params.id
                        ], (err, results) => {

                            if (err) {
                                f(err);
                            } else {

                                io.emit('reservations update');

                                s(results);
                            }

                        });

                }

            });

        },
        usuarios() {
            return new Promise((s, f) => {

                conn.query(
                    `
                    SELECT * FROM tb_usuarios ORDER BY nome
                `,
                    (err, results) => {

                        if (err) {
                            f(err);
                        } else {
                            s(results);
                        }

                    }
                );

            });
        },
        usuariosSave(req) {

            return new Promise((s, f) => {

                let form = new formidable.IncomingForm();

                form.parse(req, function (err, fields, files) {

                    let query, params;

                    if (parseInt(fields.id_usuario) > 0) {

                        query = `
                                UPDATE tb_usuarios
                                SET nome = ?, email = ?
                                WHERE id_usuario = ?
                            `;
                        params = [
                            fields.nome,
                            fields.email,
                            fields.id_usuario
                        ];


                    } else {

                        query = `
                                INSERT INTO tb_usuarios (nome, email, senha, tipo_usuario)
                                VALUES(?, ?, ?, ?)
                            `;
                        params = [
                            fields.nome,
                            fields.email,
                            fields.senha,
                            1
                        ];

                    }

                    conn.query(query, params, (err, results) => {

                        if (err) {
                            f(err);
                        } else {

                            io.emit('reservations update', fields);

                            s(fields, results);

                        }

                    }
                    );

                });

            });

        },
        usuariosDelete(req) {

            return new Promise((s, r) => {

                if (!req.params.id) {
                    f('Informe o ID.');
                } else {

                    conn.query(`
                    DELETE FROM tb_usuarios WHERE id_usuario = ?
                `, [
                            req.params.id
                        ], (err, results) => {

                            if (err) {
                                f(err);
                            } else {
                                io.emit('reservations update');
                                s(results);
                            }

                        });

                }

            });

        },
        usuariosSenha(req) {

            return new Promise((s, f) => {

                let form = new formidable.IncomingForm();

                form.parse(req, function (err, fields, files) {

                    if (err) {
                        f(err);
                    } else {

                        if (!fields.senha) {
                            f('Preencha a senha.');
                        } else if (fields.senha !== fields.senhaConfirm) {
                            f('Confirme a senha corretamente.');
                        } else {

                            conn.query(`
                            UPDATE tb_usuarios SET senha = ? WHERE id_usuario = ?
                        `, [
                                    fields.senha,
                                    fields.id_usuario
                                ], (err, results) => {

                                    if (err) {
                                        f(err);
                                    } else {
                                        s(results);
                                    }

                                });

                        }

                    }

                });

            });

        },
        contatos() {
            return new Promise((s, f) => {

                conn.query(
                    `
                    SELECT * FROM tb_contatos ORDER BY nome
                `,
                    (err, results) => {

                        if (err) {
                            f(err);
                        } else {
                            s(results);
                        }

                    }
                );

            });
        },
        contatosDelete(req) {
            return new Promise((s, r) => {

                if (!req.params.id) {
                    f('Informe o ID.');
                } else {

                    conn.query(`
                    DELETE FROM tb_contatos WHERE id_contato = ?
                `, [
                            req.params.id
                        ], (err, results) => {

                            if (err) {
                                f(err);
                            } else {
                                io.emit('reservations update');
                                s(results);
                            }

                        });

                }

            });
        },
        emails() {
            return new Promise((s, f) => {

                conn.query(
                    `
                    SELECT * FROM tb_emails ORDER BY email
                `,
                    (err, results) => {

                        if (err) {
                            f(err);
                        } else {
                            s(results);
                        }

                    }
                );

            });
        },
        emailsDelete(req) {
            return new Promise((s, r) => {

                if (!req.params.id) {
                    f('Informe o ID.');
                } else {

                    conn.query(`
                    DELETE FROM tb_emails WHERE id_email = ?
                `, [
                            req.params.id
                        ], (err, results) => {

                            if (err) {
                                f(err);
                            } else {
                                io.emit('reservations update');
                                s(results);
                            }

                        });

                }

            });
        },
        getParametros(req, params){
            return Object.assign({}, {
                menus: req.menus,
                user: req.session.user
            }, params);
        },
    
        getMenus(req){
    
            let menus = [
                {
                    text:"Tela Inicial",
                    href:"/admin",
                    icon:"home",
                    active:false
                },
                {
                    text:"Quartos",
                    href:"/admin/quartos",
                    icon:"cutlery",
                    active:false
                },
                {
                    text:"Reservas",
                    href:"/admin/reservas",
                    icon:"calendar-check-o",
                    active:false
                },
                {
                    text:"Contatos",
                    href:"/admin/contatos",
                    icon:"comments",
                    active:false
                },
                {
                    text:"Usuários",
                    href:"/admin/usuarios",
                    icon:"users",
                    active:false
                },
                {
                    text:"E-mails",
                    href:"/admin/emails",
                    icon:"envelope",
                    active:false
                }
            ];
    
            menus.map(menu => {
                if (menu.href === `/admin${req.url}`) menu.active = true;
            });
    
            return menus;
        }
    };

}


/* var conn = require("./db");

module.exports = {

    dashboard(){
        return new Promise((resolve, reject)=>{
            conn.query(`
                SELECT
                (SELECT COUNT(*) FROM tb_contatos) AS nrcontacts,
                (SELECT COUNT(*) FROM tb_quartos) AS nrquartos,
                (SELECT COUNT(*) FROM tb_reservas) AS nrreservations,
                (SELECT COUNT(*) FROM tb_usuarios) AS nrusers;
            `, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            });
        });
    },


};

        quartosSave(req) {

            return new Promise((s, f) => {

                let form = new formidable.IncomingForm({
                    uploadDir: path.join(__dirname, `../public/images`),
                    keepExtensions: true
                });

                form.parse(req, function (err, fields, files) {

                    if (err) {
                        f(err);
                    } else {

                            fields.foto = 'images/' + path.parse(files.foto.filepath).base;

                            let query, queryFoto = '' , params = [
                                fields.nome_quarto,
                                fields.descricao,
                                fields.tarifa,
                            ]; 

                            if (files.foto) {
                                queryFoto = ', foto = ?';
                                params.push(fields.foto);
                            }

                            if (parseInt(fields.id_quarto) > 0) {

                                params.push(fields.id_quarto);

                                query = `
                                UPDATE tb_quartos
                                SET nome_quarto = ?, descricao = ?, tarifa = ? ${queryFoto}
                                WHERE id_quarto = ?
                            `;

                            } else {

                                if (!files.foto) {

                                    f('A foto não foi enviada!');
        
                                } else {
                                    query = `
                                    INSERT INTO tb_quartos (nome_quarto, descricao, tarifa, foto)
                                    VALUES(?, ?, ?, ?)
                                `;
                                }
                            }

                            conn.query(query, params, (err, results) => {

                                if (err) {
                                    f(err);
                                } else {

                                    io.emit('reservations update', fields);

                                    s(fields, results);

                                }

                            }
                            );

                    }

                });

            });

        },
        
                conn.query(
                    `
                    SELECT id_quarto , nome_quarto FROM tb_quartos ORDER BY tarifa;
                `,
                    (err, results) => {

                        if (err) {

                            f(err);

                        } else {

                            s(results[0]);

                        }

                    }
                );*/
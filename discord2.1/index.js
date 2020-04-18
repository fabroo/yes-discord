const {
  Client,
  MessageEmbed,
  Channel,
  ChannelManager,
  Member
} = require('discord.js');
const client = new Client();
const cron = require('cron');
const keep_alive = require('./keep_alive.js')

const PREFIX = '!!';

// const ID_PRUEBAS_TOPLA = '697998980289790023';
// const ID_TAREAS_TOPLA = '697998867223937024';
// const ID_CLASES_TOPLA = '697999019825299457';

// const ID_PRUEBAS_KRUNKER = '698025128784560148';
// const ID_TAREAS_KRUNKER = '698025093116199093';
// const ID_CLASES_KRUNKER = '698025117460201522';

// test server ids
const ID_PRUEBAS_TOPLA = '697870006993551361';
const ID_TAREAS_TOPLA = '697870100014825592';
const ID_CLASES_TOPLA = '697969395863126036';

// const ID_PRUEBAS_KRUNKER = '697915043312042045';
// const ID_TAREAS_KRUNKER = '697915120776380426';
// const ID_CLASES_KRUNKER = '697969623081156639';


const TAREASJSON = "./jsons/tareas.json"
const PRUEBASJSON = "./jsons/pruebas.json"
const CLASESJSON = "./jsons/clases.json"

const token = process.env.DISCORD_BOT_SECRET;
const fs = require('fs');

var LocalStorage = require('node-localstorage').LocalStorage,
  localStorage = new LocalStorage('./scratch');

var ids_tareas = JSON.parse(localStorage.getItem("ids_tareas"));
var ids_pruebas = JSON.parse(localStorage.getItem("ids_pruebas"));
var ids_clases = JSON.parse(localStorage.getItem("ids_clases"));
var fechasArray = JSON.parse(localStorage.getItem("fechas"));


client.on('ready', () => {
  console.log("I'm in");
  console.log(client.user.username);

  var dateSending = false
  while(!dateSending){
    let currentDate = new Date();
    console.log(currentDate)
    for (let i = 0; i < fechasArray.length; i++) {
      const element = fechasArray[i];
      let valores = element.split('/')
        console.log(valores)
        let dia = valores[0];
        let mes = valores[1]-1;
        let year =  currentDate.getFullYear()
        let segundo = '01';
        let hora = valores[2];
        let minuto = valores[3];
        let materia = valores[4];
        let date = new Date(year, mes, dia, hora, minuto,segundo );
        date.setHours(date.getHours() + 3)//el +3 porques esta hosteado en replit
        date.setMinutes(date.getMinutes()-10)
        
        console.log(date)  
          const job = new cron.CronJob(date, function() {
            fechasArray.splice(i, 1);
            const channelTopla = client.channels.cache.get('558853823800803359');
            channelTopla.send('@everyone, ')
            channelTopla.send({
              embed: {
                color: 'GREEN',
                description: ('Gente, hay clase de **' + materia + '**')
              }
            });
            dateSending = false
            localStorage.setItem("fechas",JSON.stringify(fechasArray))
            
          },null,true,'America/Argentina/Buenos_Aires');
        job.start();
        dateSending = true
        //console.log(element)
        
    } 
    
  }
});

client.on('message', message => {
  if (message.content === 'comandoA') {
    message.channel.send({
      embed: {
        color: 'GREEN',
        description: ('**hecho por rulos y pelado kumon**')
      }
    });
  }
})

client.on('message', message => {
  if (message.content === 'hacer un bot de discord en javascript') {
    message.channel.send('Check :white_check_mark:');
  }
})

client.on('message', message => {

  let args = message.content.substring(PREFIX.length).split(" ");
  if (message.content.startsWith('!!add') || message.content.startsWith('!!sacar') || message.content.startsWith('!!help')) {
    message.react('🤏');
  }
  switch (args[0]) {
    case 'pruebas':
      if (ids_pruebas.length === 0) {
        message.channel.send({
          embed: {
            color: 'YELLOW',
            description: ('Flaco no hay más pruebas.')
          }
        });
        message.react('🤏');
        break;
      } else {
        elforeach(ID_PRUEBAS_TOPLA, PRUEBASJSON, "prueba", ids_pruebas);
        elforeach(ID_PRUEBAS_KRUNKER, PRUEBASJSON, "prueba", ids_pruebas);
        message.channel.send({
          embed: {
            color: 'GREEN',
            description: ('Gil fijate en el canal de pruebas!')
          }
        });
        message.react('🤏');
        break;
      }
    case 'tareas':
      if (ids_tareas.length === 0) {
        message.channel.send({
          embed: {
            color: 'YELLOW',
            description: ('Flaco no hay más tareas.')
          }
        });
        message.react('🤏');
        break;
      } else {
        elforeach(ID_TAREAS_TOPLA, TAREASJSON, "tarea", ids_tareas);
        elforeach(ID_TAREAS_KRUNKER, TAREASJSON, "tarea", ids_tareas);
        message.channel.send({
          embed: {
            color: 'GREEN',
            description: ('Gil fijate en el canal de tareas!')
          }
        });
        message.react('🤏');
        break;
      }
    case 'clases':
      if (ids_clases.length === 0) {
        message.channel.send({
          embed: {
            color: 'YELLOW',
            description: ('Flaco no hay más clases.')
          }
        });
        message.react('🤏');
        break;
      } else {
        elforeachClases(ID_CLASES_TOPLA, CLASESJSON, "clase", ids_clases);
        elforeachClases(ID_CLASES_KRUNKER, CLASESJSON, "clase", ids_clases);
        message.channel.send({
          embed: {
            color: 'GREEN',
            description: ('Gil fijate en el canal de clases!')
          }
        });
        message.react('🤏');
        break;
      }
      break;
    case 'help':
      message.channel.send({
        embed: {
          color: 'GREEN',
          description: ('**Guia de uso del BOT (ponele)** \n\n**!!add** se usa para agregar pruebas/tareas o clases.\n\n**!!add** _ID_tipo_materia_info_fecha_link (el ID es el identificador, el tipo depende si es tarea-prueba)\n\n En caso de agregar una clase, la sintaxis del **!!add** cambia a la siguiente: \n\n **!!add** _ID_tipo_materia_info_fecha_link_idReunion_contraseña  \n\n**!!sacar** para eliminar un recordatorio.\n\n**!!sacar** _ID_tipo (el ID es el usado previamente y el tipo ya te dijimos rey)\n\n**!!edit** sirve para editar un valor de una prueba, clase o tarea.\n\n**!!edit** _tipo_id_valorACambiar_nuevo valor \n\n**!!help** es para ver esto :)')
        }
      });
      break;
    case 'edit':
      var dataRaww = message.content;
      var dataArrayy = dataRaww.split("_").filter(e => e.trim().length > 0);
      const tipoEdit = dataArrayy[1];
      const idEdit = dataArrayy[2];
      const valueToChange = dataArrayy[3];
      const newValue = dataArrayy[4];
      if(dataArrayy.length === 5)
      {
        var toEditJson;
        var toEditJsonRoute;
        switch(tipoEdit){
          case 'prueba':
            toEditJson = fs.readFileSync(PRUEBASJSON)
            toEditJsonRoute = PRUEBASJSON
            editFunc(toEditJson, idEdit, valueToChange, toEditJsonRoute, newValue)
            elforeach(ID_PRUEBAS_TOPLA, PRUEBASJSON, "prueba", ids_pruebas);
            elforeach(ID_PRUEBAS_KRUNKER, PRUEBASJSON, "prueba", ids_pruebas);
            message.channel.send({
              embed: {
                color: 'GREEN',
                description: ('Listo rey, edita2')
              }
            });
          break;
          case 'tarea':
            toEditJson = fs.readFileSync(TAREASJSON)
            toEditJsonRoute = TAREASJSON
            editFunc(toEditJson, idEdit, valueToChange, toEditJsonRoute, newValue)
            elforeach(ID_TAREAS_TOPLA, TAREASJSON, "tarea", ids_tareas);
            elforeach(ID_TAREAS_KRUNKER, TAREASJSON, "tarea", ids_tareas);
            message.channel.send({
              embed: {
                color: 'GREEN',
                description: ('Listo rey, edita2')
              }
            });
            
          break;
          case 'clase':
            toEditJson = fs.readFileSync(CLASESJSON)
            toEditJsonRoute = CLASESJSON
            editFunc(toEditJson, idEdit, valueToChange, toEditJsonRoute, newValue)
            elforeachClases(ID_CLASES_TOPLA, CLASESJSON, "clase", ids_clases);
            elforeachClases(ID_CLASES_KRUNKER, CLASESJSON, "clase", ids_clases);
            message.channel.send({
              embed: {
                color: 'GREEN',
                description: ('Listo rey, edita2')
              }
            });
          break;
        }
        const parsedJsonToEdit = JSON.parse(toEditJson);
        parsedJsonToEdit[idEdit][valueToChange] = newValue
        const editedJson = JSON.stringify(parsedJsonToEdit,null, 4)
        fs.writeFile(toEditJsonRoute, editedJson, (err) => {
              if (err) throw err;
              /// /console.log('The file has been saved!');
            })
        
      } else {
        message.reply(' comando invalido');
      }
      break;
    case 'sacar':

      var dataRaw = message.content;
      var dataArray = dataRaw.split("_").filter(e => e.trim().length > 0);
      const tipo = dataArray[1]
      const identifier = dataArray[2];

      switch (tipo) {
        case 'prueba':
          if (ids_pruebas.length === 0) {
            message.channel.send({
              embed: {
                color: 'YELLOW',
                description: ('Flaco no hay nada para eliminar dejá de joder..')
              }
            });
            break;
          } else {
            const removePruebaJson = fs.readFileSync('./jsons/pruebas.json')
            const parsedJsonPrueba = JSON.parse(removePruebaJson);
            delete parsedJsonPrueba[identifier]
            const desParsedJsonPrueba = JSON.stringify(parsedJsonPrueba, null, 4);
            fs.writeFile('./jsons/pruebas.json', desParsedJsonPrueba, (err) => {
              if (err) throw err;
              //console.log('The file has been saved!');
            })
            let idExist = false;
            for (let index = 0; index < ids_pruebas.length; index++) {
              if (ids_pruebas[index] == identifier) {
                ids_pruebas.splice(index, 1);
                idExist = true;
              }
            }
            if (idExist) {
              message.channel.send({
                embed: {
                  color: 'YELLOW',
                  description: ('Facha fijate en el canal de pruebas! ' + '\nSe borró: ' + identifier + ', virgo')
                }
              });
            } else {
              message.channel.send({
                embed: {
                  color: 'YELLOW',
                  description: ('Facha no existe la prueba **' + identifier + '**, media pila rey.')
                }
              });
            }
            localStorage.setItem("ids_pruebas", JSON.stringify(ids_pruebas));

            elforeach(ID_PRUEBAS_TOPLA, PRUEBASJSON, "prueba", ids_pruebas);
            elforeach(ID_PRUEBAS_KRUNKER, PRUEBASJSON, "prueba", ids_pruebas);

            break;
          }
        case 'tarea':
          if (ids_tareas.length === 0) {
            message.channel.send({
              embed: {
                color: 'YELLOW',
                description: ('Flaco no hay nada para eliminar dejá de joder..')
              }
            });
            break;
          } else {
            const removeTareaJson = fs.readFileSync('./jsons/tareas.json')
            const parsedJsonTarea = JSON.parse(removeTareaJson);

            delete parsedJsonTarea[identifier]

            const desParsedJsonTarea = JSON.stringify(parsedJsonTarea, null, 4);
            fs.writeFile('./jsons/tareas.json', desParsedJsonTarea, (err) => {
              if (err) throw err;
              /// /console.log('The file has been saved!');
            })
            let idExistent = false;
            for (let index = 0; index < ids_tareas.length; index++) {
              if (ids_tareas[index] == identifier) {
                ids_tareas.splice(index, 1);
                console.log('ME BUGEE');
                idExistent = true;
              }
            }
            if (idExistent) {
              message.channel.send({
                embed: {
                  color: 'YELLOW',
                  description: ('Facha fijate en el canal de tareas! ' + '\nSe borró: ' + identifier + ', virgo')
                }
              });
            } else {
              message.channel.send({
                embed: {
                  color: 'YELLOW',
                  description: ('Facha no existe la tarea **' + identifier + '**, media pila rey.')
                }
              });
            }
            localStorage.setItem("ids_tareas", JSON.stringify(ids_tareas));

            elforeach(ID_TAREAS_TOPLA, TAREASJSON, "tarea", ids_tareas);
            elforeach(ID_TAREAS_KRUNKER, TAREASJSON, "tarea", ids_tareas);

            break;

          }

        case 'clase':
          if (ids_clases.length === 0) {
            message.channel.send({
              embed: {
                color: 'YELLOW',
                description: ('Flaco no hay nada para eliminar dejá de joder..')
              }
            });
            break;
          } else {
            const removeClaseJson = fs.readFileSync('./jsons/clases.json')
            const parsedJsonClases = JSON.parse(removeClaseJson);
            delete parsedJsonClases[identifier]
            const desParsedJsonClase = JSON.stringify(parsedJsonClases, null, 4);
            fs.writeFile('./jsons/clases.json', desParsedJsonClase, (err) => {
              if (err) throw err;
              //console.log('The file has been saved!');
            })
            let idExist = false;
            for (let index = 0; index < ids_clases.length; index++) {
              if (ids_clases[index] == identifier) {
                ids_clases.splice(index, 1);
                idExist = true;
              }
            }
            if (idExist) {
              message.channel.send({
                embed: {
                  color: 'YELLOW',
                  description: ('Facha fijate en el canal de clases! ' + '\nSe borró: ' + identifier + ', virgo')
                }
              });
            } else {
              message.channel.send({
                embed: {
                  color: 'YELLOW',
                  description: ('Facha no existe la clase **' + identifier + '**, media pila rey.')
                }
              });
            }
            localStorage.setItem("ids_clases", JSON.stringify(ids_clases));

            elforeachClases(ID_CLASES_TOPLA, CLASESJSON, "clase", ids_clases);
            elforeachClases(ID_CLASES_KRUNKER, CLASESJSON, "clase", ids_clases);

            break;
          }

      }break;

    case 'add':
      var dataRaw = message.content;
      var dataArray = dataRaw.split("_").filter(e => e.trim().length > 0);
      const id = dataArray[1];
      const type = dataArray[2];
      const materia = dataArray[3];
      const info = dataArray[4];
      const fecha = dataArray[5];
      const linkReunion = dataArray[6];
      const idReunion = dataArray[7];
      const contraReunion = dataArray[8];

      if (dataArray.length === 7) {
        switch (type) {
          case 'tarea':
            if (ids_tareas.includes(dataArray[1])) {
              message.reply(' ya existe una tarea con ese ID.');
              break;
            } else {
              ids_tareas.push(dataArray[1]);
              const todo = fs.readFile('./jsons/tareas.json', (err, texto) => {
                const jsonfile = JSON.parse(texto); //js object con la data

                jsonfile[dataArray[1]] = {
                  "materia": (dataArray[3]),
                  "temas": (dataArray[4]),
                  "fecha": (dataArray[5]),
                  "id": (dataArray[1]),
                  "link": (dataArray[6])
                }

                const jsonFileFinished = JSON.stringify(jsonfile, null, 4);
                localStorage.setItem("ids_tareas", JSON.stringify(ids_tareas));
                fs.writeFile('./jsons/tareas.json', jsonFileFinished, (err) => {
                  if (err) throw err;
                  //console.log('The file has been saved!');
                })
                elforeach(ID_TAREAS_TOPLA, TAREASJSON, "tarea", ids_tareas);
                elforeach(ID_TAREAS_KRUNKER, TAREASJSON, "tarea", ids_tareas);
                message.channel.send({
                  embed: {
                    color: 'BLUE',
                    description: ('Facha fijate en el canal de tareas!' + '\nSe agregó ' + '**' + id + '**' + ', reina.')
                  }
                });
              })
            }

            break;
          case 'prueba':
            if (ids_pruebas.includes(dataArray[1])) {
              message.reply(' ya existe una prueba con ese ID.');
              break;
            } else {
              ids_pruebas.push(dataArray[1]);
              const todo1 = fs.readFile('./jsons/pruebas.json', (err1, texto1) => {
                const jsonfile1 = JSON.parse(texto1);

                jsonfile1[dataArray[1]] = {
                  "materia": (dataArray[3]),
                  "temas": (dataArray[4]),
                  "fecha": (dataArray[5]),
                  "id": (dataArray[1]),
                  "link": (dataArray[6])
                }

                const jsonFileFinished1 = JSON.stringify(jsonfile1, null, 4);
                localStorage.setItem("ids_pruebas", JSON.stringify(ids_pruebas));
                fs.writeFile('./jsons/pruebas.json', jsonFileFinished1, (err) => {
                  if (err1) throw err1;
                  //console.log('The file has been saved!');
                })

                elforeach(ID_PRUEBAS_TOPLA, PRUEBASJSON, "prueba", ids_pruebas);
                elforeach(ID_PRUEBAS_KRUNKER, PRUEBASJSON, "prueba", ids_pruebas);

                message.channel.send({
                  embed: {
                    color: 'BLUE',
                    description: ('Facha fijate en el canal de pruebas!' + '\nSe agregó ' + id)
                  }
                });
              })
            }
            break;

        }
      } else {
        if (dataArray.length === 9 && type === 'clase') {
          if (ids_clases.includes(dataArray[1])) {
            message.reply(' ya existe una clase con ese ID.');
            break;
          } else {
            ids_clases.push(dataArray[1]);
            const todo = fs.readFile('./jsons/clases.json', (err, texto) => {
              const jsonfile = JSON.parse(texto);
              let fechaInput = dataArray[5].split('/')
              jsonfile[dataArray[1]] = {
                "materia": (dataArray[3]),
                "info": (dataArray[4]),
                "fecha": (fechaInput[0] + '/' + fechaInput[1]+ ' ' + fechaInput[2] + ':' + fechaInput[3]),
                "id": (dataArray[1]),
                "idReunion": (dataArray[7]),
                "contraReunion": (dataArray[8]),
                "link": (dataArray[6])
              }
              let fechaPlusMateria = dataArray[5] + '/' + dataArray[3]
              fechasArray.push(fechaPlusMateria);
              const jsonFileFinished = JSON.stringify(jsonfile, null, 4);
              localStorage.setItem("ids_clases", JSON.stringify(ids_clases));
              localStorage.setItem("fechas", JSON.stringify(fechasArray));
              fs.writeFile('./jsons/clases.json', jsonFileFinished, (err) => {
                if (err) throw err;
                //console.log('The file has been saved!');
              })
              //
              elforeachClases(ID_CLASES_TOPLA, CLASESJSON, "clase", ids_clases);
              elforeachClases(ID_CLASES_KRUNKER, CLASESJSON, "clase", ids_clases);

              message.channel.send({
                embed: {
                  color: 'BLUE',
                  description: ('Facha fijate en el canal de clases!' + '\nSe agregó ' + '**' + id + '**' + ', reina.')
                }
              });

            })
            break;
          }
          break;
        } else {
          message.reply(' comando invalido, forro.')
        }
      }
  }
});

function elforeach(idCanal, archivo, tipo, id_tipo) {
  fs.readFile(archivo, 'utf8', (err, jsonString) => {
    try {

      const archivoJson = JSON.parse(jsonString);
      const channelA = client.channels.cache.get(idCanal);
      channelA.bulkDelete(30);

      for (let i = 0; i < id_tipo.length; i++) {
        channelA.send({
          embed: {
            color: 'GREEN',
            description: ('**' + tipo + ' de ' + String(archivoJson[id_tipo[i]].materia) + '**' + '\nID: ' + String(archivoJson[id_tipo[i]].id) + '\nInformación: ' + String(archivoJson[id_tipo[i]].temas) + '\nFecha: ' + String(archivoJson[id_tipo[i]].fecha) + '\nLinks utiles: ' + archivoJson[id_tipo[i]].link)
          }
        });
      }
    } catch (err) {
      console.log(err)
    }
  })
}

function editFunc(json, idEdition, changeVal, route, val)
{
  const parsedJsonToEdit = JSON.parse(json);
  parsedJsonToEdit[idEdition][changeVal] = val
  const editedJson = JSON.stringify(parsedJsonToEdit,null, 4)
  fs.writeFile(route, editedJson, (err) => {
    if (err) throw err;
    /// /console.log('The file has been saved!');
    })
}

function elforeachClases(idCanal, archivo, tipo, id_tipo) {
  fs.readFile(archivo, 'utf8', (err, jsonString) => {
    try {

      const archivoJson = JSON.parse(jsonString);
      const channelA = client.channels.cache.get(idCanal);
      channelA.bulkDelete(30);

      for (let i = 0; i < id_tipo.length; i++) {
        channelA.send({
          embed: {
            color: 'YELLOW',
            description: ('**Clase de ' + String(archivoJson[id_tipo[i]].materia) + '**' + '\nID: ' + String(archivoJson[id_tipo[i]].id) + '\nInformación: ' + String(archivoJson[id_tipo[i]].info) + '\nFecha: ' + String(archivoJson[id_tipo[i]].fecha) + '\nID de reunion: ' + String(archivoJson[id_tipo[i]].idReunion) + '\nContraseña: ' + String(archivoJson[id_tipo[i]].contraReunion) + '\nLink: ' + archivoJson[id_tipo[i]].link)
          }

        });

      }
    } catch (err) {
      console.log(err)
    }
  })
}
function myFunction(){
if (ids_tareas.length === 0) {
       console.log(description: ('Flaco no hay más tareas.')
          
      } else {
        elforeach(ID_TAREAS_TOPLA, TAREASJSON, "tarea", ids_tareas);
        elforeach(ID_TAREAS_KRUNKER, TAREASJSON, "tarea", ids_tareas);
        console.log('Gil fijate en el canal de tareas!');
      }
}


client.login(token);

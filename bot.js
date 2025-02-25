const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

// Crear el bot
const bot = mineflayer.createBot({
  host: 'edaniel1212.aternos.me',  // IP de tu servidor
  port: 50239,                     // Puerto de tu servidor
  username: 'NombreDeTuBot',       // Cambia con el nombre de tu bot
  version: '1.21.4'                // Asegúrate de usar la versión correcta
});

// Cargar los plugins
bot.loadPlugin(pathfinder);

// Al conectarse
bot.on('spawn', () => {
  console.log('Bot ha entrado al servidor');

  // Establecer los movimientos del bot
  const mcData = require('minecraft-data')(bot.version);
  bot.pathfinder.setMovements(new Movements(bot, mcData));

  // Configurar el objetivo para ir a las coordenadas (0, 60, 0)
  const targetPos = new mineflayer.vec3(0, 60, 0);  // Ajusta las coordenadas para llegar al bloque

  // Establecer el objetivo para que el bot llegue a esas coordenadas
  bot.pathfinder.setGoal(new goals.GoalBlock(0, 60, 0));  // Coordenadas específicas
});

// Minar el bloque específico en las coordenadas (0, 60, 0)
bot.on('goal_reached', () => {
  const block = bot.blockAt(new mineflayer.vec3(0, 60, 0));  // Coordenadas del bloque
  if (block) {
    console.log('Bloque encontrado, comenzando a picar...');
    bot.dig(block).then(() => {
      bot.chat('Bloque minado en (0, 60, 0)');
      // Después de minar, se puede volver a establecer el objetivo para repetir el proceso
      bot.pathfinder.setGoal(new goals.GoalBlock(0, 60, 0));  // Volver a la misma posición para seguir minando
    }).catch(err => {
      bot.chat('Error al minar el bloque');
      console.log(err);
    });
  } else {
    bot.chat('No se encontró el bloque en las coordenadas especificadas.');
  }
});

// Manejar errores y reconexión
bot.on('error', (err) => {
  console.log('Error:', err);
});

bot.on('end', () => {
  console.log('Bot desconectado, intentando reconectar...');
  setTimeout(() => {
    mineflayer.createBot({
      host: 'edaniel1212.aternos.me',  // IP de tu servidor
      port: 50239,                     // Puerto de tu servidor
      username: 'NombreDeTuBot',       // Cambia con el nombre de tu bot
      version: '1.21.4'                // Versión de Minecraft
    });
  }, 5000);  // Reconectar después de 5 segundos
});

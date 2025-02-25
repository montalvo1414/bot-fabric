const mineflayer = require('mineflayer');
const pvp = require('mineflayer-pvp').plugin;
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

// Crear el bot
const bot = mineflayer.createBot({
  host: 'edaniel1212.aternos.me',  // IP de tu servidor
  port: 50239,                     // Puerto de tu servidor
  username: 'NombreDeTuBot',       // Cambia con el nombre de tu bot
  version: '1.21.4'                // Asegúrate de usar la versión correcta
});

// Cargar los plugins
bot.loadPlugin(pvp);
bot.loadPlugin(pathfinder);

// Al conectarse
bot.on('spawn', () => {
  console.log('Bot ha entrado al servidor');

  // Establecer los movimientos del bot
  const mcData = require('minecraft-data')(bot.version);
  bot.pathfinder.setMovements(new Movements(bot, mcData));

  // Configurar el objetivo para ir a las coordenadas (0, 60, 0)
  const targetPos = bot.entity.position.offset(0, 60, 0);  // Ajusta las coordenadas para llegar al bloque

  // Establecer el objetivo para que el bot llegue a esas coordenadas y mine el bloque
  bot.pathfinder.setGoal(new goals.GoalBlock(0, 60, 0));  // Coordenadas específicas
});

// Minar el bloque específico en las coordenadas (0, 60, 0)
bot.on('goal_reached', () => {
  const block = bot.blockAt(new mineflayer.vec3(0, 60, 0));  // Coordenadas del bloque
  if (block) {
    bot.dig(block).then(() => {
      bot.chat('Bloque minado en (0, 60, 0)');
    }).catch(err => {
      bot.chat('Error al minar el bloque');
      console.log(err);
    });
  } else {
    bot.chat('No se encontró el bloque en las coordenadas especificadas.');
  }
});

// Atacar mobs cercanos
bot.on('physicTick', () => {
  if (bot.pvp.target) return;  // Si está atacando, no hacer nada
  if (bot.pathfinder.isMoving()) return;  // No atacar si está en movimiento

  // Buscar mobs cercanos
  const filter = e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 16;
  const entity = bot.nearestEntity(filter);

  if (entity) {
    bot.pvp.attack(entity);  // Atacar el mob
    console.log(`Atacando al mob ${entity.mobType}`);
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

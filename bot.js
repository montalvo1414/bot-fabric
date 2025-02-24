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
});

// Seguir a un jugador
bot.on('chat', (username, message) => {
  if (message === 'follow') {
    const player = bot.players[username];
    if (player) {
      bot.pathfinder.setGoal(new goals.GoalFollow(player.entity, 1));  // Seguir al jugador con una distancia mínima de 1 bloque
      bot.chat(`Siguiendo a ${username}`);
    } else {
      bot.chat(`No se encuentra al jugador ${username}`);
    }
  }

  if (message === 'stop') {
    bot.pathfinder.setGoal(null);  // Detener el seguimiento
    bot.chat('Dejé de seguir.');
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

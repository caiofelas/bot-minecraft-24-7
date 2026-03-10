const http = require('http');

// Cria um servidor web simples para o Render não derrubar o bot
http.createServer((req, res) => {
  res.write("Bot está vivo!");
  res.end();
}).listen(8080);

const mineflayer = require('mineflayer');

const config = {
    host: 'reservado.mcsh.io', // Substitua pelo IP real
    port: 25565,
    username: 'Bot',
    version: '1.21.11'        // Ajuste conforme a versão do servidor
};

function createBot() {
    const bot = mineflayer.createBot(config);

    // Quando o bot entra no servidor
    bot.once('spawn', () => {
        console.log(`${bot.username} está online!`);
        
        // Tenta mudar para o modo criativo (requer permissão de OP no servidor)
        bot.chat('/gamemode creative');

        // Sistema Anti-AFK: Gira a cada 60 segundos
        setInterval(() => {
            const yaw = bot.entity.yaw + 0.5; // Rotaciona levemente a visão
            bot.look(yaw, bot.entity.pitch);
            console.log('Bot girou para evitar AFK kick.');
        }, 60000); // 60.000ms = 1 minuto
    });

    // Caso o bot seja desconectado, tenta voltar em 5 segundos
    bot.on('end', () => {
        console.log('Conexão perdida. Tentando reconectar...');
        setTimeout(createBot, 5000);
    });

    // Tratamento de erros para evitar que o script pare
    bot.on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
            console.log(`Falha ao conectar em ${err.address}:${err.port}`);
        } else {
            console.log('Erro inesperado:', err);
        }
    });
}

createBot();

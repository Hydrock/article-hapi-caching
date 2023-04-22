const Hapi = require('@hapi/hapi');

// Создаем сервер на порту 3000
const server = Hapi.server({
    host: 'localhost',
    port: 3000
});

// При запуске сервера создаем ложную дату последней модификации файла
const lastModified = new Date(); 

// Создаем несколько простых роутов для теста
server.route({
    method: 'GET',
    // Тут заложим роут / и /n где n не обязательный, любой, параметр
    path: '/{n?}',
    handler: function (request, h) {
        // Генерируем случайное число, по нему мы визуально поймем, поменялся ли контент на веб странице.
        const randomNum = Math.random();
        // Выводим число в консоль сервера, просто чтобы понять, происходил ли вызов handler
        console.log('randomNum: ', randomNum);

        // Создаем HTML контент с двумя перекрестными ссылками.
        const content = `
            <p>${  Math.random(randomNum) }</p>
            <a href="/"> Главная страница </a>
            <br/>
            <a href="/2"> Страница 2 </a>
        `

        // Создаем объект ответа.
        const response = h.response(content);

        // Добавляем заголовок последней модификации ресурса.
        response.header('Last-Modified', lastModified.toUTCString());
    
        return response;
    },
    options: {
        cache: {
            // Отправляем от сервера клиенту заголовок
            // cache-control: max-age=30, must-revalidate, private
            // Время указываем в миллисекундах, в самом заголовке время в секундах
            expiresIn: 10 * 1000,
            privacy: 'private'
        }
    }
});

server.route({
    method: 'GET',
    path:'/hello',
    handler: function (request, h) {
        return 'Это страница hello.';
    },
    options: {
        cache: {
            expiresIn: 30 * 1000,
            privacy: 'private'
        }
    }
});

// Запускаем сервер
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Сервер запущен по адресу:', server.info.uri);
}

start();


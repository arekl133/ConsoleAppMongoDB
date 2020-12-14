const mongo = require('mongodb');
const client = new mongo.MongoClient('mongodb://localhost:27017', {useUnifiedTopology: true});

//Funkcja dodania użytkownika
function addNewTodo(todosCollection, nr_id, name, username, date_add, user) {
    todosCollection.insertOne({
        nr_id: nr_id,
        name: name,
        username: username,
        date_add: date_add,
        user: "active",
    }, err => {
        if (err) {
            console.log('Błąd podczas dodawania!', err);
        } else {
            console.log('Zadanie dodane.');
        }

        client.close();
    });
}

//Funkcja wyswietlenia wszystkich użytkowników
function showAllTodos(todosCollection) {
    todosCollection.find({}).toArray((err, todos) => {
        if (err) {
            console.log('Błąd podczas pobierania!', err);
        } else {
        console.log(todos)
        }

        client.close();
    });
}



function deleteTask(todosCollection, id) {
    todosCollection.find({
        _id: mongo.ObjectID(id),
    }).toArray((err, todos) => {

        if (err) {

            console.log('Błąd podczas pobierania!', err);

        } else if (todos.length !== 1) {

            console.log('Nie ma takiego uzytkownika!');
            client.close();

        } else {

            todosCollection.deleteOne({
                _id: mongo.ObjectID(id),
            }, err => {
                if (err) {
                    console.log('Błąd podczas usuwania!', err);
                } else {
                    console.log('Użytkownik został poprawnie usuniety!');
                }

                client.close();
            });

        }
    });
}



function doTheToDo(todosCollection) {
    const [command, ...args] = process.argv.splice(2);

    switch (command) {
        case 'add':
            addNewTodo(todosCollection, ...args);
             break;
        case 'list':
            showAllTodos(todosCollection);
            break;
        case 'delete':
            deleteTask(todosCollection, args[0]);
            break;
        default:
            console.log(`


Dostępne komendy:

add <nr_id>, <name>, <username>, <date_add> - dodaje użytkownika
list - wyświetla wszystkich użytkowników
done <id zadania> - oznacz wybrane zadanie jako zakończone
delete <id zadania> - usuń wybranego użytkownika
cleanup - usuń zakończone zadania, jeżeli istnieją`
);
            client.close();
            break;
    }
}

client.connect(err => {
    if (err) {
        console.log('Błąd połączenia!', err);
    } else {
        console.log('Połączenie udane!');

        const db = client.db('test');

        const todosCollection = db.collection('todos');

        doTheToDo(todosCollection);

    }
});
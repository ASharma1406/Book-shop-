//original code

import express  from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    database: "DB1",
    password : '123456@',
})

app.use(express.json());
app.use(cors());

let currentUser = null;

app.get("/", (req, res) => {
    res.json("hello everyone from backend");
})

//for login 
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const q5 = "SELECT * from login WHERE email = ? AND password = ?";

    db.query(q5, [email, password], (err, result) => {
        if (err) return res.json(err);
        // return res.json("Login successfully");
        // return console.log(result);
        // let success = false;
        if (err) return res.status(500).json(err);

        if (result.length > 0) {
            // Set currentUser to the logged-in user's information
            currentUser = result[0];
            // Return user information along with success response
            return res.json({ success: true, user: currentUser });
        } else {
            return res.json({ success: false, message: "Invalid email or password" });
        }
    });
});

//to show data
app.get("/books", (req, res) => {
    const q1 = " SELECT * from books"
    db.query(q1, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

//to post data
app.post("/books", (req, res) => {
    const q2 = "INSERT INTO books (`title`, `desc`, `price`, `cover`) VALUES (?)"
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
    ];

    db.query(q2, [values], (err, data) => {
        if(err) return res.json(err);
        return res.json("books has been created");
    })
});

//to delete
app.delete("/deleteBooks/:id", (req, res) => {
    const bookId = req.params.id;
    const q3 = "DELETE from books WHERE id = ?"

    db.query(q3, [bookId], (err, data) => {
        if(err) return res.json(err);
        return res.json("books has been deleted successfully");
    })
})

//to update
app.put("/updateBooks/:id", (req, res) => {
    const bookId = req.params.id;
    const q4 = "UPDATE books SET `title` = ?, `desc`=?, `price`=?, `cover`=? WHERE id =?  ";

    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
    ]

    db.query(q4, [...values, bookId], (err, data) => {
        if(err) return res.json(err);
        return res.json("books has been updated successfully");
    });
});


// for signup 
app.post('/Signup', (req, res) => {
    const { name, email, password } = req.body;
    const q6 = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";

    db.query(q6, [name, email, password], (err, result) => {
        if (err) return res.json(err);
        return res.json("Signup succesful");
    });
});



// Add a new endpoint to get the details of the current user
app.get("/currentUser", (req, res) => {
    // Check if a user is logged in
    if (currentUser) {
        // If a user is logged in, return their details
        return res.json({ success: true, user: currentUser });
    } else {
        // If no user is logged in, return an error message
        return res.json({ success: false, message: "No user logged in" });
    }
});

app.listen(8800, () => {
    console.log("connected to backend");
})


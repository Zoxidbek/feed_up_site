const express = require('express')
const cors = require('cors')
require('dotenv').config()
const {v4} = require('uuid')
const bodyParser = require('body-parser')
const { read_file, write_file } = require('./fs/filesystem')
const ejs = require('ejs')


const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))


// get 
app.get('/get_all_foods', (req,res) => {
    try {
        const foods = read_file('foods.json')
        res.render('index',{foods})
    } catch (error) {
        console.error(error.message);
        
    }
})


// get one
app.get('/get_one_food/:id', (req,res) => {
    try {
        const {id} = req.params;
        const foods = read_file('foods.json');
        const foundedFoods = foods.find(item => item.id === id);

        if (!foundedFoods) {
          return res.status(404).send('Food not found');
        }

        res.render('details', { foundedFoods });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// add

app.post('/add_food', (req,res) => {
    try {
        const {title,new_price,old_price} = req.body
        const food = read_file('foods.json')

        food.push({
            id: v4(),
            title,
            new_price,
            old_price,
            imgUrl: "/images/food_image.webp"
        })

        write_file('foods.json',food)
        res.redirect('http://localhost:4001/get_all_foods')
    } catch (error) {
        console.error(error)
        res.status(500).send('Server xatosi')
    }
})

// delete

app.post('/delete_food/:id' , (req,res) => {
    try {
        const foods = read_file("foods.json")

        foods.forEach((item,idx)=> {
            if (item.id === req.params.id) {
                foods.splice(idx,1)
            }
        });
        
        write_file('foods.json',foods)
        res.redirect('http://localhost:4001/get_all_foods')
        
    } catch (error) {
        console.error(error.message)
    }
})

//  update
app.post('/update_food/:id' , (req,res) => {
    try {
        const {title,old_price,new_price} = req.body
        const foods = read_file("foods.json")

        foods.forEach((item,idx)=> {
            if (item.id === req.params.id) {
                item.title = title ? title : item.title
                item.old_price = old_price ? old_price : item.old_price
                item.new_price = new_price ? new_price : item.new_price
            }
        });
        
        write_file('foods.json',foods)
        res.redirect('http://localhost:4001/get_all_foods')
        
    } catch (error) {
        console.error(error.message)
    }
})





app.listen(PORT, () => {
    console.log(`SERVER RUNNING AT http://localhost:${PORT}`);
    
})
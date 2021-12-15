const mongoose = require('mongoose');
const SimpleSchema = require('simpl-schema');
const jwt = require('jsonwebtoken');

// middlewares
const corsAllow = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
};  

const isAuthorized = (req, res, next) => {
  const { authorization } = req.headers;
  //console.log("Primeiro", authorization);
  if (!authorization) return res.status(403).json({ message: 'Sem token de autenticação' });

  jwt.verify(authorization, process.env.JWT_SECRET, (err, payload) => {
    //console.log(err);
    
    //console.log("Terceiro", authorization);

    if (err) return res.status(401).json({ message: 'Token inválido' });

    req.user = payload;

    return next();
  });
};

if(Meteor.isServer) {
    // When Meteor starts, create new collection in Mongo if not exists.
    Meteor.startup(function () {
        Rating = new Meteor.Collection('Rating');
        Rating.schema = new SimpleSchema({
          "productId": {
              required: true,
              type: Number
          },
          "userEmail": {
              required: true,
              type: String
          },
          "description": {
              type: String,
              required: true
          },
          "rating": {
              type: Number,
              required: true,
              min: 1,
              max: 5
          }
      });
     });

 // GET /user - returns every message from MongoDB collection.

 Router.route('/reviews', {where: 'server'})
 
   // POST /reviews - {message as post data}
   // Add new message in MongoDB collection.
 
    .post(corsAllow, async (req, res) => {
        if(this.request.body.productId === undefined || this.request.body.userEmail === undefined) {
            response = {
                "error" : true,
                "message" : "Missing required fields"
            };
        }
        const filter = { 
            productId: req.body.productId, 
            userEmail: req.body.userEmail
        };
        const update = {
            description: req.body.description,  
            rating:req.body.rating
        };
        const options = {};

        // Find the document
        Model.findOneAndUpdate(query, update, options, function(error, result) {
            if (error) return;
            
            var response = result;
        });
        this.response.setHeader('Content-Type','application/json');
        this.response.end(response);
    });
 
 Router.route('/reviews/:id',{where: 'server'})
 
     // GET /message/:id - returns specific records
 
    .get(corsAllow, function(){
        var req = this.request;
        var res = this.response;
        console.log(req);
        console.log(res);
        if (this.params.id !== undefined) {
            var data = Rating.find({id : this.params.id})
            console.log(data);
            if (data.length > 0) {
                this.response.writeHead(200, headers);
                this.response.end(JSON.stringify(obj));
                return res.json(data);       
            } else {
                response = {
                    "error" : true,
                    "message" : "Rating not found."
                }
                return res.json(data);       
            }
        }
    })
 
     // DELETE /rating/:id delete specific record.
 
     .delete(corsAllow, function(){
         var response;
         if(this.params.id !== undefined) {
             var data = 
             Rating.find({ id : this.params.id}).fetch();
             if(data.length >  0) {
                 if(Rating.remove(data[0]._id) === 1) {
                     response = {
                         "error" : false,
                         "message" : "Review deleted."
                     }
                 } else {
                     response = {
                         "error" : true,
                         "message" : "Review not deleted."
                     }
                 }
             } else {
                 response = {
                     "error" : true,
                     "message" : "Review could not be found."
                 }
}
                      }
         this.response.setHeader('Content-Type','application/json');
         this.response.end(JSON.stringify(response));
     });
   }

// All reviews for a given product
Router.route('/reviews/product/:id', {where: "server"})
  .get(corsAllow, async (req, res) => {
  const productId = req.body.productId;
  var response = await Rating.find({where: {productId: productId}}).fetch();
  this.response.setHeader('Content-Type','application/json');
  this.response.end(JSON.stringify(response));
})

Router.route('/ratingmean/:id', {where: 'server'})

  // GET /ratings/mean - returns mean rating for a product
  .get( (req, res) => { 
      rating =  Rating.find({ productId: req.params.id});
      
      let total = 0;
      for (let i = 0; i < ratings.length; i++) {
          total = total + ratings[i].rating;
      }
      let mean = total/ratings.length;
      return mean // final rating
  });

const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject.likes;
  delete sauceObject.dislikes;
  delete sauceObject.usersLiked;
  delete sauceObject.usersDisliked;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée!'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {  
  Sauce.findOne({
      _id: req.params.id
    }).then(
      (onesauce) => {
        res.status(200).json(onesauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };
  
  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée!'}))
      .catch(error => res.status(400).json({ error }));
  };
   
  
 exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (!sauce) {
          res.status(404).json({
            error: new Error("Cette sauce n'existe pas!")
          });
        }
        if (sauce.userId !== req.auth.userId) {
          res.status(401).json({
            error: new Error('Requête non autorisée!')
          });
        } else {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Sauce supprimée!'}))
              .catch(error => res.status(400).json({ error }));
          });
        }
      })
  };


  
  exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

  exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.likes == 1) {
        sauce.usersLiked.push(sauce.userId)
        res.status(201).json({ message: "J'aime!"})
    .catch(error => res.status(400).json({ error }));
      }
      if (sauce.likes == -1) {
        sauce.usersDisliked.push(sauce.userId)
        res.status(201).json({ message: "J'aime pas!"})
      }
      if (sauce.likes == 0) {
        sauce.usersLiked.delete(sauce.userId)
        sauce.usersDisliked.delete(sauce.userId)
      }
    });
  };
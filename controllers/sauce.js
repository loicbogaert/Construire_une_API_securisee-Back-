const Sauce = require('../models/Sauces');
const fs = require('fs');

/** Controllers for the sauces (delete, modify, add...) */

class Sauces{

    /**
     * List of all the sauces
     */
    saucesArray(req, res, next){
        Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json ({ error }));
    };

    /**
     * Get only one sauce
     */
    saucesUnique(req, res, next){
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
    };

    /**
     * Add a sauce to the list (creation)
     */
    addSauce(req, res, next){
        const sauceObject = JSON.parse(req.body.sauce);
        const sauce = new Sauce({
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            usersliked : [],
            usersdisliked : [],
            likes : 0,
            dislikes : 0
        });

        sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }));
    };

    /**
     * Modify a sauce
     */
    modifySauce(req, res, next){
        const sauceObject = req.file ?
            {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body };

        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then (() => res.status(200).json({ message: 'Sauce modifiée !'}))
            .catch(error => res.status(400).json({ error }));
    };

    /**
     * Delete a sauce
     */
    deleteSauce(req, res, next){
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                .catch(error => res.status(400).json({ error }))
            });
        })
        .catch(error => res.status(500).json({ error }))
    };

    /**
     * Likes and dislikes
     */

    likeSauce(req, res, next){
        const userId = req.body.userId;
        const likes = req.body.like;

        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch(likes){
                 
        /**Front sends 1 */ /**If user likes the sauce : push the userId in the usersLiked Array + increments likes by 1 */     
     
                case 1 : 
                    if(sauce.usersLiked.includes(userId)) {
                        res.statusMessage = ('You already liked the sauce')
                        res.status(400).end() 
                    } else {
                        Sauce.updateOne(
                            {_id : req.params.id},
                            {$push : {usersLiked : userId}, $inc: {likes: +1}})

                        .then(()=>{
                            sauce.save();
                            res.status(200).json({ message : 'sauce liked'})
                        })
                        .catch(error => res.status(400).json({error}));
                    }
                break;
            
                /**Front sends -1*/ /**If user dislikes the sauce : push the userId in the usersDisliked Array + increments dislikes by 1 */

                case -1 :
                    if(sauce.usersDisliked.includes(userId)) {
                        res.statusMessage = ('You already disliked the sauce')
                        res.status(400).end() 
                    } else {
                        Sauce.updateOne(
                            {_id : req.params.id},
                            {$push : {usersDisliked : userId}, $inc: {dislikes: +1}})
                        .then(()=> {
                            sauce.save();
                            res.status(200).json({ message : 'sauce disliked'})
                        })
                        .catch(error => res.status(400).json({error}));
                    }
                break;
            
                /**Front sends 0*/ /** The users doesn't like or dislike a sauce anymore */

                case 0 :
                    if(sauce.usersLiked.includes(userId)){
                        Sauce.updateOne(
                            {_id : req.params.id},
                            {$pull: {usersLiked : userId}, $inc: {likes: -1}})
                        .then(()=> {sauce.save();
                            res.status(200).json({ message : 'Like reseted'})
                        })
                        .catch(error => res.status(400).json({error}));    
                    }
                    else if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne(
                            {_id : req.params.id},
                            {$pull: {usersDisliked : userId}, $inc: {dislikes: -1}})

                        .then(()=> {sauce.save();
                            res.status(200).json({ message : 'dislike reseted'})
                        })
                        .catch(error => res.status(400).json({error}));
                    }
                break;
            };
        });
    }
};

module.exports = Sauces;


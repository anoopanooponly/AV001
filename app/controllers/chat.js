/**
 * Created by ams on 12/13/13.
 */
exports.chat = function(req, res){

    console.log("here at chat");
    res.render('chat/chat');
};

//exports.partials = function (req, res) {
//    var name = req.params.name;
//    res.render('partials/' + name);
//};
const needle = require('needle');
var htmlToJson = require('html-to-json');
const format =  require('date-fns/format');
const data = {
    ifis_bonetider_widget_city: 'Södertälje, SE',
    ifis_bonetider_widget_date: ' '
    //ifis_bonetider_widget_date: format(Date.now(), 'EEEE dd MMMM yyyy')
};

function sendRequest(){
    var jsonObject = {};
    needle('post', 'https://www.islamiskaforbundet.se/wp-content/plugins/bonetider/Bonetider_Widget.php', data, {json: false})
        .then((res) => {
            //console.log(`Status: ${res.statusCode}`);
            htmlToJson.parse(res.body, {
                ul: function (doc) {
                    var key = 'data';
                    jsonObject[key] = {};
                    var data = doc.find('ul').text().split('\n');
                    //console.log(data[1].match(/[a-zA-Z]+|[0-9]+/g));
                    var i;
                    jsonObject.data.timings = {};
                    for (i = 1; i < data.length - 1; i = i + 2) {
                        var waqt = data[i].match(/[a-z]+|[^a-z]+/gi)[1];
                        //console.log(waqt, time)
                        jsonObject.data.timings[waqt.toString()] = data[i].match(/[a-z]+|[^a-z]+/gi)[2];
                    }
                    //console.log(jsonObject);
                }
            });
            //console.log('Body: ', res.body);
        }).catch((err) => {
        console.error(err);
    });
    return jsonObject;
}
module.exports={sendRequest};

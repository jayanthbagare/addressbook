

var countries_states = null;
var cities = [];
let db;
var objPerson={};
this.db = new PouchDB('addressbook');
var remoteCouch = false;

async function get_countries_and_states_and_cities(){
    var countries_state;
    //Look for Countries and States
    await fetch('https://jayanthbagare.github.io/country_state_cities/countries%2Bstates.json')
        .then(result => {
            return result.json();
        })
        .then(out => {
            for(var m=0;m<=out.length - 1;m++){   
                var selectElement = document.getElementById("inline-country");
                var option = document.createElement("option");
                option.text = out[m].name;
                option.value = out[m].iso2;
                selectElement.add(option);
            }
            countries_states = out
        });
       
       
        //Look for Cities
        await fetch('https://jayanthbagare.github.io/country_state_cities/states%2Bcities.json')
            .then(result => {
                return result.json()})
            .then(out_cities => {
                cities = out_cities;
            });
}

function load_countries(){
    // this.get_countries_and_states_and_cities();
}

function load_states(){
    var states = [];
    var ce = document.getElementById("inline-country");
    var chosen_country = document.getElementById("inline-country").value;

    document.getElementById("display-country").innerHTML = ce.options[ce.selectedIndex].text;

    for(var ct=0;ct<=countries_states.length - 1;ct++){
        if(countries_states[ct].iso2 == chosen_country){
            states = countries_states[ct].states;
        }
    }
    for(var st=0;st<states.length;st++){
        var selectElement = document.getElementById("inline-states");
        var option = document.createElement("option");
        option.text = states[st];
        option.value = states[st];
        selectElement.add(option);
    }
    
}

function load_cities(){
    var city_list = [];
    var chosen_state = document.getElementById("inline-states").value;
    
    this.objPerson.country = document.getElementById("inline-country").value;
    this.objPerson.state = chosen_state;
    
    for(var st=0;st<=cities.length -1 ; st++){
        if(cities[st].name == chosen_state){
            city_list = cities[st].cities; 
        }
    }

    for(var ci=0;ci<=city_list.length - 1; ci++){
        var selectElement = document.getElementById("inline-city");
        var option = document.createElement("option");
        option.text = city_list[ci];
        option.value = city_list[ci];
        selectElement.add(option);
    }
}

function writeName(){
    var name = document.getElementById("inline-full-name").value;
    document.getElementById("display-name").innerHTML = name;
    this.objPerson.name = name;
}

function writeEmail(){
    var email = document.getElementById("inline-email").value;
    document.getElementById("display-email").innerHTML = email;
    this.objPerson.email = email;
}

function writeCity(){
    var ce = document.getElementById("inline-city");
    document.getElementById("display-city").innerHTML = ce.options[ce.selectedIndex].text;
    
    this.objPerson.city = ce.options[ce.selectedIndex].value;
}

function writeAddress1(){
    var addr = document.getElementById("inline-address1").value
    document.getElementById("display-address1").innerHTML = addr;
    this.objPerson.addr1 = addr
}

function writeAddress2(){
    var addr = document.getElementById("inline-address2").value
    document.getElementById("display-address2").innerHTML = addr;
    this.objPerson.addr2 = addr
}

function loadPicture(input){
    var reader = new FileReader();

    let file = input.files[0];
    reader.onload = function(input) {
        document.getElementById("display-picture").src=reader.result;
        
    };
    reader.readAsDataURL(file);
}

function save(input){
    this.objPerson.picture = document.getElementById("display-picture").src;
    var g = document.getElementsByName("female").value
    if(g != undefined){
        this.objPerson.gender = "female"
    }else{
        this.objPerson.gender = "male"
    }
    console.log(this.objPerson);
    //Call Save Contact to PouchDB
    this.addContact(this.objPerson);
}

window.onload = function(){
    console.log('Window Loaded');
    // this.db = new PouchDB('addressbook');
    // var remoteCouch = false;
    this.get_countries_and_states_and_cities();
}

function addContact(contact){
    this.objPerson._id = this.objPerson.email;
    this.db.put(contact,function callback(err,result){
        if(!err){
            console.log('Saved the contact');
        }else{
            console.error(err);
        }
    })
}
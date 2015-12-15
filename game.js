/**
 * Created by Frank on 12/16/2015.
 */


function sleep(miliseconds) {
    var currentTime = new Date().getTime();
    while (currentTime + miliseconds >= new Date().getTime()) {
        //do nothing;
    }
}
var Game = function () {
    var bao = document.getElementById('bao');
    var bao_machine_side = document.getElementById('machine-side');
    var bao_user_side = document.getElementById('user-side');

    var USER_TURN = 0;
    var MACHINE_TURN = 1;

    this.turn = USER_TURN;
    this.switch_turn = function () {
        this.turn = (this.turn + 1) % 2;
    };

    this.machine_shimos = [];
    this.user_shimos = [];

    this.machine_scores = 0;
    this.user_scores = 0;

    var index = 0;
    while (index < 8) {
        this.machine_shimos.push(new Shimo('ms' + index, this));
        this.user_shimos.push(new Shimo('us' + index, this));
        index++;
    }

    var  context = this; //ugly

    var MachineState = function() {
        this.front = 0;
        this.back = 0;
        this.total;

        this.refresh = function (){
            for (x in context.machine_shimos) {
                if (context.machine_shimos[x].isFrontLiner) {
                    this.front += context.machine_shimos[x].value;
                } else {
                    this.back += context.machine_shimos[x].value;
                }
            }
        }
    };


    function getCurrentShimo(pos, turn) {
        return context.user_shimos[pos];
    }

    function getOpposite(current_shimo) {
        var op_pos = 9 - current_shimo.pos;
        console.log('Opposite pos:', op_pos);
        if (this.belongsToMachine){
            return context.user_shimos[op_pos];
        } else {
            return context.machine_shimos[op_pos];
        }
    }

    function getFarOpposite(current_shimo) {
        var op_pos = (current_shimo.pos + 4)%8;
        console.log('Far Opposite pos:', op_pos);
        if (this.belongsToMachine){
            return context.user_shimos[op_pos];
        } else {
            return context.machine_shimos[op_pos];
        }

    }

    context.checks_and_balances = function (zilizochotwa) {
        if (this.turn == USER_TURN) {
            this.user_scores += zilizochotwa;
            this.machine_scores -= zilizochotwa;

            document.getElementById('m').innerHTML = this.machine_scores;
            document.getElementById('u').innerHTML = this.user_scores;
        }
    };

    function isOppositeFrontEmpty(op_shimo) {
        var sum = 0;
        if (op_shimo.belongsToMachine) {
            //it belongs to machine so sum machine's frontline..
            sum = context.machine_shimos[3].value + context.machine_shimos[4].value +
                context.machine_shimos[5].value +context.machine_shimos[6].value;
        } else {
            sum = context.user_shimos[3].value + context.user_shimos[4].value +
            context.user_shimos[5].value +context.user_shimos[6].value;
        }
        console.log('Sum of opposite front_line: ', sum);
        return (sum === 0);

    }



    function doneFilling(pos) {
        pos = pos % 8;
        console.log('finished at '+pos);
        var current_shimo = getCurrentShimo(pos, 0);

        if (current_shimo.value === 1) {
            //kufa hapa
            console.log('Umekufa baba');
        }
        else  {
            //continue playing
            if (current_shimo.isFrontLiner) {
                var opposite_shimo = getOpposite(current_shimo);

                //check if empty front line,  them make opposite far opposite
                if (opposite_shimo.value === 0) {
                    var empty_front = isOppositeFrontEmpty(opposite_shimo);
                    if (empty_front) {
                        opposite_shimo = getFarOpposite(current_shimo);
                    }
                }

                var zilizochotwa = opposite_shimo.zoa();
                current_shimo.add(zilizochotwa);
                context.checks_and_balances(zilizochotwa);
            }

            context.play(current_shimo);

        }

    }

    this.play = function (shimo) {
        var pos = shimo.pos;
        var idadi = shimo.value;
        shimo.zoa();

        console.log('Started at :', shimo);

        pos = pos + 1; //move to the next shimo

        var fill = function(){
            shimo.getParentArray()[(pos++)% 8].dropKete();
            idadi--;
            if (idadi > 0) setTimeout(fill, 700); //continue filling
            else (doneFilling(pos-1));

        }

        fill();

    };
};

var Shimo;
Shimo = function (id, gameInstance) {
    this.sid = id;
    this.pos = parseInt(id.substr(2, 1));
    this.value = 4;
    this.isBox = false;
    this.span = document.getElementById(id);

    this.bg_color = '#ffffff';

    var context = this;

    this.belongsToMachine = (id.substr(0,1) == 'm');

    this.getParentArray = function() {
        return (this.belongsToMachine ?  gameInstance.machine_shimos : gameInstance.user_shimos);
    };

    this.isBox = (this.pos == 0);
    this.isFrontLiner = (this.pos > 2 && this.pos < 7);

    if (this.isBox) {
        this.bg_color = '#f3f9f5'
        this.span.style.background = this.bg_color ;
    }

    if (this.isFrontLiner) {
        this.span.style.fontWeight = '400';
    }

    this.setValue = function (value) {
        this.value = value;
        this.span.innerHTML = this.value;
    };


    this.dropKete = function () {
        this.setValue(this.value + 1);
        this.span.style.background = '#75F38E';
        setTimeout(function() {context.span.style.background = '#fff';}, 300);
    };

    this.add = function(x){
        this.setValue(this.value + x);
        flashGreen();
    };

    this.zoa = function () {
        var had = this.value;
        this.setValue(0);
        flashRed();
        return had;
    };

    function flashGreen() {
        context.span.style.background = '#75F38E';
        setTimeout(function() {context.span.style.background = context.bg_color;}, 300);
    }

    function flashRed() {
        context.span.style.background = '#F3AFA5';
        setTimeout(function() {context.span.style.background = context.bg_color;}, 300);
    }



    this.setValue(1); //initialize to 4

    this.clicked = function clicked() {
        if (context.value > 0) {
            gameInstance.play(context);
        }
    };

    this.span.addEventListener('click', this.clicked);

};


Game.prototype.initialize = function () {

};
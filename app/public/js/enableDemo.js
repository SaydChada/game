/**
 * Demo to allow player to play alone until someone challenge him
 */
'use strict';
class Demo{
    constructor(){
        this.active = true;
        this.colors = ['warning','info', 'success', 'primary', 'danger'];
        this.blockBtns = null;
        this.timeOut = null;
    }

    /**
     * Shuffle colors
     */
    randomizeColors(){

        for (let i = this.colors.length -1 ; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            let temp = this.colors[i];
            this.colors[i] = this.colors[j];
            this.colors[j] = temp;
        }
    }
    renderElement(){
        this.blockBtns = [];
        this.randomizeColors();
        for(var i = 1; i <= this.colors.length ; ++i){
            var cssClass = 'btn-'+ this.colors[i -1];
            this.blockBtns.push('<p title="" class="btn '+ cssClass +'">'+ i +'</p> ');
        }
        return this.blockBtns;
    }

    checkColors(userColors){
        var choiceJoin = userColors.join();
        var gameColors = this.colors.join();

        return choiceJoin === gameColors;
    }

    renderDemo($gameCombinaisons) {

        if(!this.active){
            return;
        }
        this.timeOut && clearTimeout(this.timeOut);
        $gameCombinaisons.empty();
        $gameCombinaisons.append($('<p>Démo en atendant un adversaire :-) </p>'));
        $gameCombinaisons.append(this.renderElement());

        this.timeOut = setTimeout(function(){
            $gameCombinaisons.children('.btn').attr('class', 'btn btn-default');
        }, 5000);

    }
}
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        // Maintain reference to the tree object
        this.tree = null;

        /**List of all elements that will populate the table.*/
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = null;

        ///** Store all match data for the 2018 Fifa cup */
        this.teamData = teamData;

        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** letiables to be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null;


        /** Used for games/wins/losses*/
        this.gameScale = null;

        /**Color scales*/
        /**For aggregate columns*/
        /** Use colors '#feebe2' and '#690000' for the range*/
        this.aggregateColorScale = null;


        /**For goal Column*/
        /** Use colors '#cb181d' and '#034e7b' for the range */
        this.goalColorScale = null;
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains


        let maxGoal = Math.max.apply(Math, this.teamData.map(d => d["value"]["Goals Made"]));

        // let minGoal = Math.min.apply(Math, this.teamData.map(d => d["value"]["Goals Made"]));

        let gsWidth = 200;
        let gsHeight = 50

        let goalScale = d3.scaleLinear()
            .domain([0, maxGoal])
            .range([10, gsWidth-10]);


        let axis = d3.axisTop(goalScale);

        let goalHeader = d3.select("#goalHeader").append("svg")
            .attr("width", gsWidth)
            .attr("height", gsHeight)
            .attr("margin", "5px");


        goalHeader.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0, 25)")
            .call(axis);

        //add GoalAxis to header of col 1.

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        let team = d3.select("#matchTable > thead > tr").selectAll("th");

        let headers = d3.select("#matchTable thead > tr").selectAll("td")
            .on("click", (d,i) => this.sortByCol(i));

        console.log("headers", headers);
        console.log("team", team);


        //Set sorting callback for clicking on Team header
        //Clicking on headers should also trigger collapseList() and updateTable().

        this.tableElements = this.teamData;


    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows


        console.log("this.tableElements", this.tableElements);

        let svgs = d3.select("#matchTable  tbody").selectAll("td").selectAll("svg").remove();



       let tr = d3.select("#matchTable  tbody").selectAll("tr")
            .data(this.tableElements).join("tr");
        // EXIT
        // Remove old elements as needed.

        console.log("this.tr", tr);

       let th = tr.selectAll("th").data(d => {return [d]; })
           .join("th")
           // .text((d, i) =>  {if(d["value"] === "aggregate"){return d["key"] } else{
           //     return "game"
           // }})
           .on("click", (d,i) => this.updateList(d["key"]));

        th.text(d => {
            if(d.value.type === "aggregate"){
                return  d["key"];
            }
            else{
                return "  vs. " +  d["key"];
            }
        })
            .style("color", d => {
                if(d.value.type === "game"){
                    return "gray";
                }
            });


        console.log("th", th);




        let td = tr.selectAll("td").data(d => this.cellArray(d)).join("td");



        let goals = td.filter((d) => {
           return d.vis === "goals"
       });

        let bars = td.filter((d) => {
            return d.vis === "bar";
        });

        let rounds = td.filter((d) => {
            return d.vis === 'text'
        });


        let games = td.filter(d => {return d.type === "game"});



        rounds.join("text")
            .text(d => d["val"]);


        //Todo:scale using td cellwidth and height values
       let barSvgs = bars.append("svg")
           .attr("class", "chart")
            .attr("width", 50)
            .attr("height", 25);

       let barHeight = 20;

       barSvgs
            .append("rect")
            .attr("width", d => d["val"] * 5)
            .attr("height", barHeight)
            .attr("fill", "red")
           .attr("opacity", d => d["val"]/7);


        barSvgs
            .append("text")
            .style("fill", "black")
            .attr("x", 0)
            .attr("y", barHeight / 2 - 2)
            .attr("dy", "6px")
            .text(d => d["val"]);





        let goalSvgs = goals.append("svg")
            .attr("width", 200)
            .attr("height", 25);


        goalSvgs.append("rect")
            .attr("width", d => Math.abs(d["val"]["GoalsConceded"] -d["val"]["GoalsMade"]) * 12.5)
            .attr("height", 10)
            .attr("x",d =>  Math.min(d["val"]["GoalsConceded"], d["val"]["GoalsMade"]) * 12.5 )
            .attr("y", 3)
            .style("fill", d => {
                if(d.type === "aggregate") {
                    if (d.val.GoalsMade - d.val.GoalsConceded > 0) {
                        return "blue";
                    } else if (d.val.GoalsMade - d.val.GoalsConceded < 0) {
                        return "red";
                    } else {
                        return "gray";
                    }
                }
                    else{
                        return "none";
                }
            })
            .attr("opacity", 0.5);


        //Todo, translate circles to goal scale exactly
        goalSvgs.append("circle")
            .attr("r", 5)
            .attr("cy", barHeight / 2 - 2)
            .attr("cx",d => d["val"]["GoalsMade"] * 12.5)
            .style("fill", d => {
                if (d.type === "aggregate"){
                    return "blue";
                }
                else{
                    return "white";
                }

            })
            .style("stroke", d =>{
                if(d.type === "game"){
                    return "blue";
                }
            });


        goalSvgs.append("circle")
            .attr("r", 5)
            .attr("cy", barHeight / 2 - 2)
            .attr("cx",d => d["val"]["GoalsConceded"] * 12.5)
            .style("fill", d => {
                if (d.type === "aggregate"){
                    return "red"
                }
                else{
                    return "white";
                }

            })
            .style("stroke", d =>{
                if(d.type === "game"){
                    return "red";
                }
            });






        // d3.select("#matchTable > tbody").selectAll("tr").selectAll('td')
        //     .data(this.teamData )
        //     .enter().append('td');





















        //Append th elements for the Team Names

        //Append td elements for the remaining columns.
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'vis' :<'bar', 'goals', or 'text'>, 'value':<[array of 1 or two elements]>}

        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray

    };


    makeCell(type,vis, val){

        return{"type": type, "vis": vis, "val": val};

    }
    cellArray(d){
        // console.log("d inside cell array", d);

        let value = d["value"]

        let type = value["type"];

        let gc = this.makeCell(type, "goals", {"GoalsMade" : value["Goals Made"], "GoalsConceded" : value["Goals Conceded"]});

        let rc = this.makeCell(type, "text", value["Result"]["label"]);

        let wc = this.makeCell(type, "bar", value["Wins"]);

        let lc = this.makeCell(type, "bar", value["Losses"]);

        let tc = this.makeCell(type, "bar", value["TotalGames"]);




        return [gc, rc, wc, lc, tc];
    }




    sortByCol(i){

        let tr = d3.select("#matchTable > tbody").selectAll("tr");


        if(i === 0) {
            this.sortByGoalDiff();
        }

        this.updateTable();

    }

    sortByGoalDiff(){
        let preSort = this.tableElements.slice(0);

        this.tableElements.sort(function (a, b) {
            if (a.value["Goals Made"] - a.value["Goals Conceded"] < b.value["Goals Made"] - b.value["Goals Conceded"]) {
                return -1;
            }
            if (a.value["Goals Made"] - a.value["Goals Conceded"] > b.value["Goals Made"] - b.value["Goals Conceded"]) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });


        console.log("presort, tableElements", preSort, this.tableElements);

        let arrEq = function arraysEqual(a1, a2) {
            /* WARNING: arrays must not contain {objects} or behavior may be undefined */
            return JSON.stringify(a1) == JSON.stringify(a2);
        }


        if (arrEq(preSort, this.tableElements)) {
            console.log("presort, tableElements", preSort, this.tableElements);
            console.log("must reverse sort");

            this.tableElements.sort(function (a, b) {
                if (a.value["Goals Made"] - a.value["Goals Conceded"] > b.value["Goals Made"] - b.value["Goals Conceded"]) {
                    return -1;
                }
                if (a.value["Goals Made"] - a.value["Goals Conceded"] < b.value["Goals Made"] - b.value["Goals Conceded"]) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            });
        }
    }

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(country) {

        let i = this.getIndexFromList(country);
        // ******* TODO: PART IV *******

        console.log("index passed to update list", i);

        let type = this.tableElements[i].value.type;

        if("type" === "game"){
            return;
        }


        let typeOfNext = this.tableElements[i+1].value.type;



        //console.log("this.tableElements[i]", this.tableElements[i]);



        if(type === "aggregate" && typeOfNext === "aggregate") {
            let games = this.tableElements[i]["value"]["games"];

            for (let g = 0; g < games.length; g++) {
                this.tableElements.splice(i + g + 1, 0, games[g]);
                console.log("i, g, games[g]", i, g, games[g]);
            }
        }

        else if(type === "aggregate" && typeOfNext === "game"){

            this.tableElements = this.collapseTeam(i);

            // console.log("this.tableElements after collapse", this.tableElements);
        }


        this.updateTable();

        //Only update list for aggregate clicks, not game clicks

    }

    getIndexFromList(country){
        console.log("getting index for country", country);
        console.log(this.tableElements);

        let index = this.tableElements.findIndex(p => p.key === country);

        console.log("index", index);

        return index;

    }

    collapseTeam(i){
        console.log("collapsing team at index ", i);

        // console.log("this.tableElements[i+1]", this.tableElements[i+1].value);

        let te = this.tableElements[i+1];


        while(te.value.type === "game"){
            console.log("first te", te);
            this.tableElements.splice(i+1, 1);
            console.log("this.tableELements after splice", this.tableElements)
            te = this.tableElements[i+1];
            console.log("next te", te);
        }
        return this.tableElements;
    }


    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {

        let te = [];

        for(let i = 0; i < this.tableElements.length; i++){
            if(this.tableElements[i].value.type === "aggregate"){
                te.push(this.tableElements[i]);
            }
        }

        this.tableElements = te;
        // ******* TODO: PART IV *******

    }


}

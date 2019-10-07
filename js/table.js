/** Class implementing the table. */
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


       let tr = d3.select("#matchTable  tbody").selectAll("tr")
            .data(this.tableElements);


        tr.exit().remove();


        tr = tr.enter().append("tr");

        // EXIT
        // Remove old elements as needed.


       let th = tr.append("th")
           .text((d, i) =>  {if(this.tableElements[i]["value"]["type"] === "aggregate"){return this.tableElements[i]["key"] } else{
               return "game"
           }})
           .on("click", (d,i) => this.updateList(i));


       let td = tr.selectAll("td").data(d => this.cellArray(d)).enter().append("td");



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



        rounds.append("text")
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
            .attr("x",d => Math.min(d["val"]["GoalsConceded"], d["val"]["GoalsMade"]) * 12.5)
            .attr("y", 3)
            .style("fill", d => d["val"]["GoalsMade"] - d["val"]["GoalsConceded"] > 0 ? "blue" : "red")
            .attr("opacity", 0.5);


        //Todo, translate circles to goal scale exactly
        goalSvgs.append("circle")
            .attr("r", 5)
            .attr("cy", barHeight / 2 - 2)
            .attr("cx",d => d["val"]["GoalsMade"] * 12.5)
            .style("fill", "blue");


        goalSvgs.append("circle")
            .attr("r", 5)
            .attr("cy", barHeight / 2 - 2)
            .attr("cx",d => d["val"]["GoalsConceded"] * 12.5)
            .style("fill", "red");






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

        console.log("type", type);

        let gc = this.makeCell(type, "goals", {"GoalsMade" : value["Goals Made"], "GoalsConceded" : value["Goals Conceded"]});

        let rc = this.makeCell(type, "text", value["Result"]["label"]);

        let wc = this.makeCell(type, "bar", value["Wins"]);

        let lc = this.makeCell(type, "bar", value["Losses"]);

        let tc = this.makeCell(type, "bar", value["TotalGames"]);




        return [gc, rc, wc, lc, tc];
    }

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******

        console.log("this.updateList called");

        console.log("this.tableElements[i]", this.tableElements[i]);

        console.log("i", i);

        let games = this.tableElements[i]["value"]["games"];

        console.log("games", games);

        for(let g = 0; g <  games.length; g++){
            this.tableElements.splice(i + g + 1, 0, games[g]);
            console.log("i, g, games[g]", i, g, games[g]);
        }

        // this.tableElements.splice(i, 0, games);

        console.log("this.tableElements", this.tableElements);

        this.updateTable();

        //Only update list for aggregate clicks, not game clicks

    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {

        // ******* TODO: PART IV *******

    }


}

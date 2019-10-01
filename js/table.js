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

        console.log("teamData", this.teamData);

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

    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows

        this.tableElements = this.teamData;

       let tr = d3.select("#matchTable > tbody").selectAll("tr")
            .data(this.tableElements)
            .enter().append("tr");

       let th = tr.append("th")
           .text(d => d["key"]);


       let td = tr.selectAll("td").data(d => this.cellArray(d)).enter().append("td")
           .text(d => d["val"]);



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

        let gc = this.makeCell("aggregate", "goals", {"GoalsMade" : value["Goals Made"], "GoalsConceded" : value["Goals Conceded"]});

        let rc = this.makeCell("aggregate", "text", value["Result"]["label"]);

        let wc = this.makeCell("aggregate", "bar", value["Wins"]);

        let lc = this.makeCell("aggregate", "bar", value["Losses"]);

        let tc = this.makeCell("aggregate", "bar", value["Total Games"]);

        console.log("goalcell", gc);

        console.log("round cell", rc);


        return [gc, rc, wc, lc, tc];
    }

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******

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

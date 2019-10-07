/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {

    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******

        let width = 500;
        let height = 900;

        console.log("treeData", treeData);



        var treeLayout = d3.tree();

        let root = d3.stratify()
            .id((d, i) => {return  i })
            .parentId(d => {return  d.ParentGame })
            (treeData);

        console.log("root")



        let treeSvg = d3.select("#tree");

        treeLayout(root);

        var wScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, width]);

        let hScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, height]);




        treeSvg.selectAll('circle.node')
            .data(root.descendants())
            .enter()
            .append('circle')
            .classed('node', true)
            .attr('cx', function(d) {return wScale(d.y) + 15;})
            .attr('cy', function(d) {return hScale(d.x);})
            .attr('r', 4)
            .attr("fill", d => {if(d.data.Wins === "0") {
                     return "red"
        }
                else{
                    return "blue"
        }
        })
            .attr("log", d => console.log("d", d))


        treeSvg.selectAll("text.node")
            .data(root.descendants())
            .enter()
            .append('text')
            .text(d => d.data.Team)
            .attr("x", function(d) {return wScale(d.y) + 15;})
            .attr("y", function(d) {return hScale(d.x) - 5;});

        treeSvg
            .selectAll('line.link')
            .data(root.links())
            .enter()
            .append('line')
            .classed('link', true)
            .attr('x1', function(d) {return wScale(d.source.y) + 15;})
            .attr('y1', function(d) {return hScale(d.source.x);})
            .attr('x2', function(d) {return wScale(d.target.y) + 15;})
            .attr('y2', function(d) {return hScale(d.target.x);});

        //Create a tree and give it a size() of 800 by 300.


        //Create a root for the tree using d3.stratify();


        //Add nodes and links to the tree.
    }

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******

    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops!
    }
}

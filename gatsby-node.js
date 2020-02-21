const fetch = require("node-fetch")
const queryString = require("query-string")

window.gnewsquery = "cannabis south africa";
process.env.gnewsapikey = "93cfbf47a0e44c71ba78a52b29c16ab6";

exports.onPreInit = () => {
    console.log("on Pre Init ...")
}

exports.sourceNodes = (
    {actions, createNodeId, createContentDigest},
    configOptions
) => {
    const {createNode, createNodeField} = actions

    // Gatsby adds a configOption that's not needed for this plugin, delete it
    delete configOptions.plugins

    // Helper function that processes a photo to match Gatsby's node structure
    const processContent = content => {
        const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        const nodeId = createNodeId(`${random}`)
        const nodeContent = JSON.stringify(content)
        const nodeData = Object.assign({}, content, {
            slug: `news/${nodeId}.html`,
            id: nodeId,
            uid:  nodeId,
            parent: null,
            children: [],
            internal: {
                type: `News`,
                mediaType: `text/html`,
                content: nodeContent,
                contentDigest: createContentDigest(content),
            },
        })
        return nodeData
    }

    const apikey = process.env.gnewsapikey;
    const query = window.gnewsquery;

    const url = "http://newsapi.org/v2/everything?q="+ query +"&apiKey=" + apikey;

    // Gatsby expects sourceNodes to return a promise
    return (

        fetch(url).then(res => {
            
            return res.json()

        }).then(data => {

            data.articles.forEach(content => {
                // Process the data to match the structure of a Gatsby node
                const nodeData = processContent(content)
                // Use Gatsby's createNode helper to create a node from the node data
                // console.log('nodeData',nodeData)
                createNode(nodeData)
            })

        })

    )
}
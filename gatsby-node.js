const fetch = require("node-fetch")
const queryString = require("query-string")

exports.onPreInit = () => {
    console.log("Testing...")
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
            // title: content.title,
            parent: null,
            children: [],
            internal: {
                type: `News`,
                mediaType: `text/html`,
                content: nodeContent,
                contentDigest: createContentDigest(content),
            },
        })
        // console.log('nodeData',nodeData)
        return nodeData
    }

    // plugin code goes here...
    // console.log("Testing gatsby-source-liferay plugin", configOptions)

    // Construct Liferay API URL for structured-content
    // const apiUrl = `http://${configOptions.host}/o/headless-delivery/v1.0/sites/${configOptions.siteId}/structured-contents/`

const apikey = "93cfbf47a0e44c71ba78a52b29c16ab6"
const url = "http://newsapi.org/v2/everything?q=cannabis+south+africa&apiKey=" + apikey;
const config = {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
}



    const init = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${configOptions.authKey}`
        }
    }


    // Gatsby expects sourceNodes to return a promise
    return (

        fetch(url).then(res => {
            return res.json()
        }).then(data => {

            // console.log('** News ', data)

            data.articles.forEach(content => {

                // console.log("Gnews article - cannabis south africa : ", content.title)

                // Process the data to match the structure of a Gatsby node
                const nodeData = processContent(content)

                console.log("nodeData--> ", nodeData);

                // Use Gatsby's createNode helper to create a node from the node data
                // console.log('nodeData',nodeData)
                createNode(nodeData)
            })

        })

        
        // // Fetch a response from the apiUrl
        // fetch(apiUrl, init)
        // // Parse the response as JSON
        //     .then(response => response.json())
        //     // Process the JSON data into a node
        //     .then(data => {
        //         // For each query result (or 'items')
        //         data.items.forEach(content => {
        //             console.log("Liferay article: ", content.title)

        //             // Process the data to match the structure of a Gatsby node
        //             const nodeData = processContent(content)

        //             //console.log("nodeData--> ", nodeData);

        //             // Use Gatsby's createNode helper to create a node from the node data
        //             createNode(nodeData)
        //         })

        //     })
    )
}
var axios = require('axios');
const fs = require('fs');
const inputData = require('./data');
var config = {
  method: 'post',
  url: 'https://search-enterprise-prod-es-zuxtyowhuzs4j47aeqxhmohd2i.us-east-1.es.amazonaws.com/_plugin/kibana/api/console/proxy?uri=enterprise_catalog_search_alias%2F_search',
  headers: { 
    'authority': 'search-enterprise-prod-es-zuxtyowhuzs4j47aeqxhmohd2i.us-east-1.es.amazonaws.com', 
    'accept': 'text/plain, */*; q=0.01', 
    'accept-language': 'en-US,en;q=0.9', 
    'cache-control': 'no-cache', 
    'content-type': 'application/json', 
    'kbn-version': '5.3.2', 
    'origin': 'https://search-enterprise-prod-es-zuxtyowhuzs4j47aeqxhmohd2i.us-east-1.es.amazonaws.com', 
    'pragma': 'no-cache', 
    'referer': 'https://search-enterprise-prod-es-zuxtyowhuzs4j47aeqxhmohd2i.us-east-1.es.amazonaws.com/_plugin/kibana/app/kibana', 
    'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"Windows"', 
    'sec-fetch-dest': 'empty', 
    'sec-fetch-mode': 'cors', 
    'sec-fetch-site': 'same-origin', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
  }
};
let ids = [];
let promises = [];
let responses = [];
for (let index = 0; index < inputData.length; index++) {
    ids.push(inputData[index]);
    if (index % 10 === 0 || index === inputData.length) {
        config.data = JSON.stringify({
            "_source": [
              "name",
              "id"
            ],
            "query": {
              "bool": {
                "must": [
                  {
                    "term": {
                      "type": "Product"
                    }
                  },
                  {
                    "terms": {
                      "id": ids
                    }
                  },
                  {}
                ]
              }
            }
          });
          promises.push(
        axios(config)
        .then(function (response) {
          responses = responses.concat(response.data.hits.hits.map((x) => x._source));
        })
        .catch(function (error) {
          console.log(error);
        }));        
        ids = []
    }

}

Promise.all(promises).then(() => fs.writeFileSync('data.json', JSON.stringify(responses)));






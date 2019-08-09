const HTMLParser = require('fast-html-parser')
const fs = require('fs')
const objects = []
fs.readFile('index.html', 'utf8', function(err, contents) {
    const root = HTMLParser.parse(contents)
    const rows = root.querySelectorAll('tr')
    transformToJsonFile(rows)
    var file = fs.createWriteStream('objects.json');
    objects.forEach(object => file.write(JSON.stringify(object) + ',\n'))
    file.end()
})

const extractFirstColumn = element => {
    const firstColumn = element.querySelector('td').childNodes
    firstColumn.shift()
    firstColumn.shift()
    return firstColumn
}

const transformToJsonFile = rows => {
    Array.prototype.forEach.call(rows, row => {
        const firstColumn = extractFirstColumn(row)
        var info = ''
        var name = ''
        var sidc = ''
        Array.prototype.forEach.call(firstColumn, element => {
            if(element.tagName === 'em'){
                if(element.text != 'SIDC:')
                info+= element.text + ' '
            }
            else if(element.tagName === 'b')
                name = element.text
            else if(typeof element.tagName === 'undefined'){
                sidc = element.text
                sidc = sidc.trim()
                sidc = replaceChar(sidc, 1, 'F')
                sidc = sidc.replace(/\*/i, '-')
                objects.push({'name':name, 'info':info.trim(), 'sidc': sidc})
                info = ''
                name = ''
                sidc = ''
            }
        })
      });
}

const replaceChar = (str, index, char) => {
    return str.substr(0,index) + char + str.substr(index+1)
}
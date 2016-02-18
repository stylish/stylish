# Assets

Skypager Projects consist of two types of files: `Assets` and `Helpers` 

Assets consist of content such as markdown writing, or files that contain data, code, or images.

Assets which can be parsed can be used to generate data for the Project's entities.

## Specifications

### Skypager makes assets available through different collections

```javascript
project.content.documents.assets.should.not.be.empty()
project.content.assets.assets.should.not.be.empty()
project.content.data_sources.assets.should.not.be.empty()
```

### Skypager treats svg assets as normal Assets

SVG Assets can be embedded in rendered markdown documents by using a special embed syntax.

```javascript
project.content.assets.at('example').uri.should.match(/example.svg/)
project.content.assets.at('example').should.have.property('assetType', 'asset')
```

### Skypager assets have a dedicated parser

```javascript
project.content.documents.at('index').parser.should.be.a.Function
```

### Skypager treats markdown as Document assets

```javascript
project.content.documents.at('index').should.have.property('assetType', 'document')
project.content.documents.at('index').should.have.property('parser')
```

### Skypager treats JSON as parseable DataSource assets 

```javascript
project.content.data_sources.at('example').should.have.property('assetType', 'DataSource')
project.content.data_sources.at('example').should.have.property('parser')
```

### Skypager treats YAML as parseable DataSource assets 

```javascript
project.content.data_sources.at('inspiration').should.have.property('assetType', 'DataSource')
project.content.data_sources.at('inspiration').should.have.property('parser')
```

### Skypager treats CSV as parseable DataSource assets 

```javascript
project.content.data_sources.at('tabular').should.have.property('assetType', 'DataSource')
project.content.data_sources.at('tabular').should.have.property('parser')
```

### Skypager treats Javascript as parseable DataSource assets 

```javascript
project.content.data_sources.at('community-plugins').should.have.property('assetType', 'DataSource')
project.content.data_sources.at('community-plugins').should.have.property('parser')
```

# Website Copy and Translations

When developing a website it is easy to just write the labels and text directly into the source code.  There is nothing wrong with this approach for a simple website with only a few pages, especially when you will be the only one working with the source code.  

For a larger website, or for a project where you will be collaborating with somebody else who is supplying the text or "copy", keeping this content separate from the source code has many potential benefits:

- Multi-lingual sites and translations (i18n) 
- Easily A/B test phrases ( landing page optimization )
- Give non-coders people the ability to edit copy
- Easier to re-use components when there isn't specific content in them

## Example

To begin with, a project has settings which specify what different apps are 

```yaml
en:
  web:
    home:
      title: Title

es:
  web:
    home:
      title: Titulo
```


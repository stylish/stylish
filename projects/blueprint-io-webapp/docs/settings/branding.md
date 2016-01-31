# Branding

## Settings

### Brand Icon

Which primary icon we want to use throughout the app?

```yaml
name: brandIcon
type: string
canSkip: true
default: rocket
options:
  'Choose from a list':
    data: 'data/brandIcons'
  'Select an icon':
    type: file,
    formats: ['svg', 'png']
```

### Brand Style

Which base brand style should we begin with?

```yaml
name: brandStyle
options:
  - default
```

### Mobile Splash Screen

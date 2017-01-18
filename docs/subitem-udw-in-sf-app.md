# Idea: Black boxing SubitemList/UDW/Tree in a WebComponent:

## Reasonning

* standardized technology
* from server side pov, easy to generate, since those would be a tag almost like
  any other


## SubitemList

### Features of SubitemList

* asynchronously load and display the subitems :)
* navigation (click on a Location to view it)
* display of thumbnails
* edit priority

### Interaction with other part of the page

* when changing Location's sort field and/or sort order, the list is updated

### Example

```twig
{# view of a Location #}
<h1>{{ location.contentInfo.name }}</h1>

<!-- ... --->

<ez-subitem-list
    parent-location-id="{{ path( 'ezpublish_rest_loadLocation', location ) }}"
    ></ez-subitem-list>
```

Internally, we need a *fake* app object to provide at least the JavaScript REST
Client instance and most likely others things ? Maybe, we also need to replicate
others types of components (View Services or even top level view)

Questions:

    * how/when are the YUI modules loaded ? in the .html defining the Web
      Component ? Would that work ? What if several web components does the
      same?
    * Navigation to a Location: how does that happen ?
    * Display of thumbnail: keeping the current code doable, but involves
      keeping more YUI based code (plugin to image variation)

## UDW

## Tree

# CHANGELOG - vue-remote-template

## 0.6.0 (2017-05-29)

* Change the wording "handler" to "extension"
* Get metadata from the root.dataset directly

## 0.5.0 (2017-05-29)

* Remove `initialTemplatePath` and `initialHandleName` properties.

## 0.4.0 (2017-05-28)

* Add `submit` method to the dynamic components.

## 0.3.0 (2017-05-28)

* Add handler support.
* Change property names: `path` -> `templatePath`,
  `initialPath` -> `initialTemplatePath`.
* Get document title from `data-meta` attribute of the root element of template.
  Not from `document-title` HTTP header or `title` attribute
  of the root element of template.
* Get document url (for pushState) from `data-meta` attribute of the root
  element of template.

## 0.2.0 (2017-05-28)

* Get document title from `document-title` HTTP header or `title` attribute
  of the root element of template.

## 0.1.0 (2017-05-28)

* The first release

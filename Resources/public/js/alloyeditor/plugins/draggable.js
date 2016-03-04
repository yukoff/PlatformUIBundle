/*
 * Copyright (C) eZ Systems AS. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
/* global CKEDITOR */
YUI.add('ez-alloyeditor-plugin-draggable', function (Y) {
    "use strict";

    var DIRECTION_DOWN = 1,
        DIRECTION_UP = 2,
        DIRECTION_NONE = 0,
        direction = (function () {
            var lastEvent;

            return {
                init: function (dragEvent) {
                    lastEvent = dragEvent;
                },

                get: function (dragEvent) {
                    var diff, res = DIRECTION_NONE;

                    if ( lastEvent ) {
                        diff = dragEvent.$.clientY - lastEvent.$.clientY;
                        if ( diff > 0 ) {
                            res = DIRECTION_DOWN;
                        } else if ( diff < 0 ) {
                            res = DIRECTION_UP;
                        }
                    }
                    lastEvent = dragEvent;
                    return res;
                }
            };
        })();

    if (CKEDITOR.plugins.get('ezdraggable')) {
        return;
    }

    function moveCaretToElement(editor, element) {
        var range = editor.createRange();

        range.moveToPosition(element, CKEDITOR.POSITION_AFTER_END);
        editor.getSelection().selectRanges([range]);
    }

    function unsetDraggable(block) {
        block.removeAttribute('draggable');
    }

    function setDraggable(block) {
        block.setAttribute('draggable', 'true');
    }

    function isDraggable(block) {
        return !!block.getAttribute('draggable');
    }

    function addHandleElement(block) {
        var handle;

        if ( block.findOne('.ez-draggable-handle') ) {
            return;
        }
        handle = new CKEDITOR.dom.element('span');
        handle.addClass("ez-draggable-handle").addClass('ez-font-icon');
        handle.setAttribute('contenteditable', "false");
        block.append(handle, true);
    }

    function fireEditorInteractionEvent (editor, nativeEventName, nativeEventTarget, selectionData) {
        editor.fire('editorInteraction', {
            nativeEvent: {
                target: nativeEventTarget,
                editor: editor,
                name: nativeEventName,
            },
            selectionData: selectionData,
        });
    }

    function prepareDragDrop(e) {
        var focusBlock = e.data.block,
            oldBlock = e.data.oldBlock;

        if ( oldBlock ) {
            unsetDraggable(oldBlock);
        }
        if ( focusBlock ) {
            addHandleElement(focusBlock);
            setDraggable(focusBlock);
        }
    }

    function initDragDrop(editor) {
        var rootEditor = editor.element;

        function getDropTarget(rootEditor, node) {
            var target = node;

            while ( !rootEditor.equals(target.getParent()) ) {
                target = target.getParent();
            }
            return target;
        }

        rootEditor.on('dragstart', function (param) {
            var event = param.data,
                target = event.getTarget();

            direction.init(event);
            while ( !isDraggable(target) ) {
                target = target.getParent();
            }
            target.addClass('is-being-dragged');

            // TODO add id if none
            event.$.dataTransfer.setData('block/id', '#' + target.getId());
            fireEditorInteractionEvent(editor, "dragstart", target.findOne('.ez-draggable-handle').$, {});
        });
        rootEditor.on('dragend', function (param) {
            var event = param.data;

            event.getTarget().removeClass('is-being-dragged');
        });
        rootEditor.on('dragover', function (param) {
            var event = param.data,
                target, dir;

            if ( !rootEditor.equals(event.getTarget()) ) {
                event.preventDefault();
                event.$.dataTransfer.dropEffect = 'move';

                target = getDropTarget(rootEditor, event.getTarget());

                dir = direction.get(event);
                if ( dir === DIRECTION_DOWN ) {
                    target
                        .removeClass('is-dragging-before')
                        .addClass('is-dragging-after');
                } else if ( dir === DIRECTION_UP ) {
                    target
                        .removeClass('is-dragging-after')
                        .addClass('is-dragging-before');
                }
            }
        });
        rootEditor.on('dragleave', function (param) {
            var event = param.data,
                target = event.getTarget();
                
            if ( !rootEditor.equals(target) ) {
                target = getDropTarget(rootEditor, target);
                target.removeClass('is-dragging-before').removeClass('is-dragging-after');
            }
        });
        rootEditor.on('drop', function (param) {
            var event = param.data,
                target = getDropTarget(rootEditor, event.getTarget()),
                droppedElement = rootEditor.findOne(event.$.dataTransfer.getData('block/id'));

            if ( target.hasClass('is-dragging-before') ) {
                droppedElement.insertBefore(target);
                target.removeClass('is-dragging-before');
            } else {
                droppedElement.insertAfter(target);
                target.removeClass('is-dragging-after');
            }
            droppedElement.removeClass('is-being-dragged');
            editor.focus();
            target.focus();
            moveCaretToElement(editor, droppedElement);
            fireEditorInteractionEvent(editor, "drop", droppedElement.findOne('span').$, editor.getSelectionData());
        });
    }

    /**
     *
     * @class ezdraggable
     * @namespace CKEDITOR.plugins
     * @constructor
     */
    CKEDITOR.plugins.add('ezdraggable', {
        init: function (editor) {
            editor.on('focusedBlockUpdate', prepareDragDrop);
            initDragDrop(editor);
            // TODO getData remove ez-draggable-handle
        },
    });
});

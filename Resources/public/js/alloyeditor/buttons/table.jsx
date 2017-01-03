/*
 * Copyright (C) eZ Systems AS. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
YUI.add('ez-alloyeditor-button-table', function (Y) {
    "use strict";

    var AlloyEditor = Y.eZ.AlloyEditor,
        React = Y.eZ.React,
        ButtonTable;

    /**
     * The ButtonTable component represents a button to add a table.
     *
     * @uses AlloyEditor.ButtonCommand
     * @uses AlloyEditor.ButtonStateClasses
     *
     * @class eZ.AlloyEditor.ButtonTable
     */
    ButtonTable = React.createClass({
        mixins: [
            AlloyEditor.ButtonCommand,
            AlloyEditor.ButtonStateClasses,
        ],

        statics: {
            key: 'eztable'
        },

        getDefaultProps: function () {
            return {
                command: 'eZAddContent',
                modifiesSelection: true,
            };
        },

        render: function () {
            if (this.props.renderExclusive) {
                return (
                    <AlloyEditor.ButtonTableEdit {...this.props} />
                );
            }

            var css = "ae-button ez-ae-labeled-button" + this.getStateClasses();

            return (
                <button className={css} onClick={this.props.requestExclusive} tabIndex={this.props.tabIndex}>
                    <span className="ez-ae-icon ez-ae-icon-table ae-icon-table"></span>
                    <p className="ez-ae-label">{Y.eZ.trans('table', {}, 'onlineeditor')}</p>
                </button>
            );
        },
    });

    AlloyEditor.Buttons[ButtonTable.key] = AlloyEditor.ButtonTable = ButtonTable;
});

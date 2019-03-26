/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module table/commands/splittablecommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import TableUtils from '../tableutils';
import { findAncestor } from './utils';

/**
 * The split table command.
 *
 * The command is registered by {@link module:table/tableediting~TableEditing} as `'splitTableVertically'`
 * and `'splitTableHorizontally'`  editor commands.
 *
 * You can split any table vertically or horizontally by executing this command. For example, to split the selected table vertically:
 *
 *    editor.execute( 'splitTableVertically' );
 *
 * @extends module:core/command~Command
 */
export default class SplitTableCommand extends Command {
  /**
   * Creates a new `SplitTableCommand` instance.
   *
   * @param {module:core/editor/editor~Editor} editor The editor on which this command will be used.
   * @param {Object} options
   * @param {String} options.direction Indicates whether the command should split table `'horizontally'` or `'vertically'`.
   */
  constructor( editor, options = {} ) {
    super( editor );

    /**
     * The direction that indicates which table will be split.
     *
     * @readonly
     * @member {String} #direction
     */
    this.direction = options.direction || 'horizontally';

    /**
     * The position of the offset to use when splitting the table.
     * Can be one of `before` or `after`
     *
     * @readonly
     * @type {String} #offsetPreference
     */
    this.offsetPreference = options.offsetPreference || 'after';
  }

  /**
   * @inheritDoc
   */
  refresh() {
    const model = this.editor.model;
    const doc = model.document;

    const table = findAncestor( 'table', doc.selection.getFirstPosition() );

    this.isEnabled = !!table;
  }

  /**
   * @inheritDoc
   */
  execute() {
    const model = this.editor.model;
    const document = model.document;
    const selection = document.selection;

    const firstPosition = selection.getFirstPosition();
    const table = findAncestor( 'table', firstPosition );

    // The cell at which we we need to execute this operation
    // If the direction is `horizontally` then we split the table
    // to the right of this cell
    //
    // If direction is `vertically`, then split the table below this cell.
    //
    // We can also use a preference marker that says split `before` or `after`.
    // So in this case `horizontally` and `after` means split to the right
    // *after* this cell
    const tableCell = findAncestor( 'tableCell', firstPosition );

    const isHorizontally = this.direction === 'horizontally';
    const insertAfter = this.offsetPreference === 'after';

    const tableUtils = this.editor.plugins.get( TableUtils );

    if ( isHorizontally ) {
      tableUtils.splitTableAlongRows( table, tableCell, insertAfter, firstPosition );
    } else {
      tableUtils.splitTableAlongColumns( table, tableCell, insertAfter, firstPosition );
    }
  }
}

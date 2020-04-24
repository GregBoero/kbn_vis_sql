import ace from 'brace';
import {ElasticsearchSqlHighlightRules} from "../../../../../../../src/legacy/core_plugins/console/public/np_ready/application/models/legacy_core_editor/mode/elasticsearch_sql_highlight_rules";

// const oop = ace.acequire('ace/lib/oop');
const TextMode = ace.acequire('ace/mode/text').Mode;


export class CustomSqlMode extends TextMode {
  HighlightRules = ElasticsearchSqlHighlightRules;
}

// export function CustomSqlMode(this: any) {
//   // @ts-ignore
//   this.$tokenizer = new AceTokenizer(new ElasticsearchSqlHighlightRules().getRules());
//   // this.$outdent = new MatchingBraceOutdent();
//   this.$behaviour = new CstyleBehaviour();
//   // this.foldingRules = new CStyleFoldMode();
// }
// oop.inherits(CustomSqlMode, TextMode);
//
// (function (this: any) {
//   this.HighlightRules = ElasticsearchSqlHighlightRules;
//
//   this.getNextLineIndent = function (state:any, line:any, tab:any) {
//     let indent = this.$getIndent(line);
//     const match = line.match(/^.*[\{\[]\s*$/);
//     if (match) {
//       indent += tab;
//     }
//
//     return indent;
//   };
//
//   this.checkOutdent = function (state:any, line:any, input:any) {
//     return this.$outdent.checkOutdent(line, input);
//   };
//
//   this.autoOutdent = function (state:any, doc:any, row:any) {
//     this.$outdent.autoOutdent(doc, row);
//   };
//
// }.call(CustomSqlMode.prototype));











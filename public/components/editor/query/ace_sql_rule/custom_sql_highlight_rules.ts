import ace from 'brace';
import { ElasticsearchSqlHighlightRules } from '../../../../../common/import';

// const oop = ace.acequire('ace/lib/oop');
const TextMode = ace.acequire('ace/mode/text').Mode;

export class CustomSqlMode extends TextMode {
  HighlightRules = ElasticsearchSqlHighlightRules;
}

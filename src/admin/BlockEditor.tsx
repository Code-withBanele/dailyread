import type { ArticleBlock } from '../types/article';

export type ContentBlock = string | ArticleBlock;

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

const BLOCK_LABELS: Record<string, string> = {
  paragraph: 'Paragraph',
  heading2: 'Heading (H2)',
  heading3: 'Heading (H3)',
  heading: 'Heading',
  image: 'Image',
  quote: 'Quote',
  blockquote: 'Blockquote',
  list: 'List',
  bold: 'Bold paragraph',
  italic: 'Italic paragraph',
};

function isObjectBlock(block: ContentBlock): block is ArticleBlock {
  return typeof block === 'object' && block !== null && 'type' in (block as Record<string, unknown>);
}

function updateAt(blocks: ContentBlock[], index: number, value: unknown): ContentBlock[] {
  const next = blocks.slice();
  next[index] = value as ContentBlock;
  return next;
}

function removeAt(blocks: ContentBlock[], index: number): ContentBlock[] {
  return blocks.filter((_, i) => i !== index);
}

function move(blocks: ContentBlock[], index: number, delta: number): ContentBlock[] {
  const target = index + delta;
  if (target < 0 || target >= blocks.length) return blocks;
  const next = blocks.slice();
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const addParagraph = () => onChange([...blocks, '']);
  const addHeading = (level: 2 | 3) =>
    onChange([...blocks, level === 2 ? { type: 'heading2', value: '' } : { type: 'heading3', value: '' }]);
  const addQuote = () => onChange([...blocks, { type: 'quote', content: '' }]);
  const addImageBlock = () => onChange([...blocks, { type: 'image', src: '', alt: '', caption: '' }]);

  return (
    <div className="block-editor">
      <div className="block-editor-list">
        {blocks.map((block, index) => {
          const label = isObjectBlock(block) ? BLOCK_LABELS[(block as ArticleBlock).type] ?? (block as ArticleBlock).type : 'Paragraph';

          return (
            <div key={index} className="block-editor-item">
              <div className="block-editor-item-header">
                <span className="block-editor-label">{label}</span>
                <div className="block-editor-item-controls">
                  <button type="button" onClick={() => onChange(move(blocks, index, -1))} disabled={index === 0}>↑</button>
                  <button type="button" onClick={() => onChange(move(blocks, index, 1))} disabled={index === blocks.length - 1}>↓</button>
                  <button type="button" className="danger" onClick={() => onChange(removeAt(blocks, index))}>Remove</button>
                </div>
              </div>

              {typeof block === 'string' ? (
                <textarea
                  value={block}
                  onChange={(e) => onChange(updateAt(blocks, index, e.target.value))}
                  rows={3}
                  placeholder="Paragraph text…"
                />
              ) : (block as ArticleBlock).type === 'heading2' || (block as ArticleBlock).type === 'heading3' ? (
                <input
                  type="text"
                  value={(block as { value: string }).value ?? ''}
                  onChange={(e) =>
                    onChange(updateAt(blocks, index, { ...(block as { type: string; value: string }), value: e.target.value }))
                  }
                  placeholder="Heading text…"
                />
              ) : (block as ArticleBlock).type === 'quote' || (block as ArticleBlock).type === 'blockquote' ? (
                <textarea
                  value={(block as { content?: string; value?: string }).content ?? (block as { value?: string }).value ?? ''}
                  onChange={(e) => onChange(updateAt(blocks, index, { ...(block as Record<string, unknown>), content: e.target.value }))}
                  rows={2}
                  placeholder="Quote text…"
                />
              ) : (block as ArticleBlock).type === 'image' ? (
                <div className="block-editor-image-fields">
                  <input
                    type="text"
                    value={(block as { src?: string }).src ?? ''}
                    onChange={(e) => onChange(updateAt(blocks, index, { ...(block as Record<string, unknown>), src: e.target.value }))}
                    placeholder="Image URL or uploaded key (/api/images/…)"
                  />
                  <input
                    type="text"
                    value={(block as { alt?: string }).alt ?? ''}
                    onChange={(e) => onChange(updateAt(blocks, index, { ...(block as Record<string, unknown>), alt: e.target.value }))}
                    placeholder="Alt text…"
                  />
                  <input
                    type="text"
                    value={(block as { caption?: string }).caption ?? ''}
                    onChange={(e) => onChange(updateAt(blocks, index, { ...(block as Record<string, unknown>), caption: e.target.value }))}
                    placeholder="Caption (optional)…"
                  />
                </div>
              ) : (block as ArticleBlock).type === 'list' ? (
                <div className="block-editor-list-fields">
                  <textarea
                    value={((block as { items?: string[] }).items ?? []).join('\n')}
                    onChange={(e) =>
                      onChange(
                        updateAt(blocks, index, {
                          ...(block as Record<string, unknown>),
                          items: e.target.value.split('\n'),
                        }),
                      )
                    }
                    rows={3}
                    placeholder={'One list item per line…'}
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean((block as { ordered?: boolean }).ordered)}
                      onChange={(e) =>
                        onChange(updateAt(blocks, index, { ...(block as Record<string, unknown>), ordered: e.target.checked }))
                      }
                    />
                    Ordered (numbered)
                  </label>
                </div>
              ) : (block as ArticleBlock).type === 'bold' || (block as ArticleBlock).type === 'italic' ? (
                <textarea
                  value={(block as { value?: string }).value ?? ''}
                  onChange={(e) => onChange(updateAt(blocks, index, { ...(block as Record<string, unknown>), value: e.target.value }))}
                  rows={2}
                  placeholder={`${(block as ArticleBlock).type} text…`}
                />
              ) : (
                <pre>{JSON.stringify(block, null, 2)}</pre>
              )}
            </div>
          );
        })}
      </div>

      <div className="block-editor-add">
        <button type="button" onClick={addParagraph}>+ Paragraph</button>
        <button type="button" onClick={() => addHeading(2)}>+ Heading (H2)</button>
        <button type="button" onClick={() => addHeading(3)}>+ Heading (H3)</button>
        <button type="button" onClick={addQuote}>+ Quote</button>
        <button type="button" onClick={addImageBlock}>+ Image</button>
      </div>
    </div>
  );
}

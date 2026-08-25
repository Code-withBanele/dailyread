import './ArticleContent.css';
import type { ArticleBlock } from '../types/article';
import { InArticleAd } from './InArticleAd';

interface ArticleContentProps {
  content: (string | ArticleBlock)[];
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="article-body">
      {content.map((block, index) => {
        if (typeof block === 'string') {
          return (
            <>
            <p className="article-paragraph">
              {block}
            </p>
            {index === 1 && <InArticleAd />}
            </>
          );
        }

        if (block.type === 'heading2') {
          return (
            <h2 key={index} className="article-h2">
              {block.value}
            </h2>
          );
        }

        if (block.type === 'heading' && block.level === 2) {
          return <h2 key={index} className="article-h2">{block.content}</h2>;
        }

        if (block.type === 'heading3') {
          return (
            <h3 key={index} className="article-h3">
              {block.value}
            </h3>
          );
        }

        if (block.type === 'heading' && block.level === 3) {
          return <h3 key={index} className="article-h3">{block.content}</h3>;
        }

        if (block.type === 'paragraph') {
          return (
            <>
              <p className="article-paragraph">{block.content}</p>
              {index === 1 && <InArticleAd />}
            </>
          );
        }

        if (block.type === 'bold') {
          return (
            <p key={index} className="article-paragraph">
              <strong>{block.value}</strong>
            </p>
          );
        }

        if (block.type === 'italic') {
          return (
            <p key={index} className="article-paragraph">
              <em>{block.value}</em>
            </p>
          );
        }

        if (block.type === 'blockquote') {
          return (
            <blockquote key={index} className="article-blockquote">
              {block.value}
            </blockquote>
          );
        }

        if (block.type === 'quote') {
          return <blockquote key={index} className="article-blockquote">{block.content}</blockquote>;
        }

        if (block.type === 'list') {
          const List = block.ordered ? 'ol' : 'ul';
          return (
            <List key={index} className="article-list">
              {block.items?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </List>
          );
        }

        if (block.type === 'image') {
          return (
            <figure key={index} className="article-figure">
              <img src={block.src ?? block.value ?? ''} alt={block.alt ?? 'Article content'} />
              {block.caption && <figcaption>{block.caption}</figcaption>}
            </figure>
          );
        }

        return null;
      })}
    </div>
  );
}

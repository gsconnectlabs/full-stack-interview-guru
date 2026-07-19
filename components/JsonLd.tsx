/**
 * Renders a JSON-LD <script> for structured data. Reusable SEO utility so all
 * schema.org blocks are emitted the same way. Content is author-generated, not
 * user input.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

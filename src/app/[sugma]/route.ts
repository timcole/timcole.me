import { readFileSync } from 'fs';

export async function GET(
  _: Request,
  { params }: { params: { sugma: string } },
) {
  const links: Record<string, string> = JSON.parse(
    readFileSync('./links.json', 'utf-8'),
  );

  let link = links[params.sugma];
  if (link) return Response.redirect(link);
  else return new Response('Not found', { status: 404 });
}

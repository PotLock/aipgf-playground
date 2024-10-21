import { ExternalLink } from './external-link';

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">Start Your Prompt Here!</h1>
        <p className="leading-normal text-muted-foreground">
          Please upload{' '}
          <ExternalLink href="https://docs.google.com/document/d/1UZRfOE1JAOhsnSmp-RmL2hY7KPJbpBImKZVvPV4YJmA/">
            Template file
          </ExternalLink>
        </p>
      </div>
    </div>
  );
}

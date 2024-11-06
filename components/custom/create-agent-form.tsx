import Form from 'next/form';

import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function CreateAgentForm({
  action,
  children
}: {
  action: any;
  children: React.ReactNode;
}) {
  return (
    <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="text"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Name Agent
        </Label>

        <Input
          id="name"
          name="name"
          className="bg-muted text-md md:text-sm"
          type="text"
          placeholder="Super Agent"
          autoComplete="text"
          required
          autoFocus
          defaultValue={''}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Password
        </Label>

        <Input
          id="password"
          name="password"
          className="bg-muted text-md md:text-sm"
          type="password"
          required
        />
      </div>

      {children}
    </Form>
  );
}

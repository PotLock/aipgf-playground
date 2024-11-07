import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


export default async function Page() {


  return <Card className="w-[350px]">
    <CardHeader>
      <CardTitle>Agen Name</CardTitle>
      <CardDescription>Deploy your new project in one-click.</CardDescription>
    </CardHeader>
    <CardContent>
      123
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button className="w-full">Start Chat</Button>
    </CardFooter>
  </Card>;
}

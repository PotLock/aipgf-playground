'use client'

import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Code } from "@/components/ui/code"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"


interface TransactionReviewProps {
  dapp: {
    name: string
    url: string
  }
  type: string
  amount: string
  from: string
  to: string
  fees: {
    estimated: string
    limit: string
    deposit: string
  }
  contact: {
    id: string
    call: string
    details: {
      recipient_id: string
      register_id: string
      message: string
      promise_id: string
    }
  }
  onApprove: () => void
  onDecline: () => void
}

export default function TransactionReview({
  dapp,
  type,
  amount,
  from,
  to,
  fees,
  contact,
  onApprove,
  onDecline
}: TransactionReviewProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFunctionCallOpen, setIsFunctionCallOpen] = useState(false)

  // Add defensive checks
  if (!dapp || !fees || !contact) {
    return <div>Error: Missing required props</div>
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">Review Transaction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Dapp</span>
            <div className="flex items-center gap-2">
              <span>{dapp.name}</span>
              <a 
                href={dapp.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tx Type</span>
            <span className="text-green-600">{type}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span>{amount}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">From</span>
            <span className="font-mono text-sm">{from}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">To</span>
            <span className="font-mono text-sm">{to}</span>
          </div>

          <Collapsible 
            open={isDetailsOpen} 
            onOpenChange={setIsDetailsOpen}
            className="w-full border-t pt-4"
          >
            <CollapsibleTrigger className="flex items-center justify-center w-full py-2 text-sm text-muted-foreground hover:text-foreground">
              Transaction Details
              {isDetailsOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4">
              <div className="pt-4 space-y-4 pb-4 border-b">
                <h3 className="font-semibold">Network Fees</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estimated Fees</span>
                    <span>{fees.estimated} NEAR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Fee Limit</span>
                    <span>{fees.limit} Tgas</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Deposit</span>
                    <span>{fees.deposit} NEAR</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="font-semibold">Contact Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">For Contract</span>
                    <span className="font-mono text-sm">{contact.id}</span>
                  </div>
                  <Collapsible 
                    open={isFunctionCallOpen} 
                    onOpenChange={setIsFunctionCallOpen}
                    className="w-full"
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm text-muted-foreground hover:text-foreground">
                      <span>Function Call</span>
                      <div className="flex items-center">
                        <span className="mr-2 text-xs">{contact.call}</span>
                        {isFunctionCallOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <Code className="w-full text-xs">
                        {JSON.stringify(contact.details, null, 2)}
                      </Code>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onDecline}
        >
          Decline
        </Button>
        <Button
          className="flex-1"
          onClick={onApprove}
        >
          Approve
        </Button>
      </CardFooter>
    </Card>
  )
}


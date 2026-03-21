/*
  judgeCppFiles:
    - Judges the output of a compiled C++ program against expected output
    - Executes the program and captures its output
    - Compares the program's output to the expected output
    - Returns a judgment result (Pass/Fail)
    - Returns the actual and expected output
*/
import type { JudgeCppRequest, JudgeCppResult } from '../../shared/compiler'
import { executeCppFiles } from './executeCppFiles'

async function cleanOutput(output: string): Promise<string> {
  // Remove extra whitespace and newlines for simplified comparison
  return output.trim().replace(/\s+/g, ' ')
}


async function judgeCppFiles(request: JudgeCppRequest): Promise<JudgeCppResult> {
  const executionResult = await executeCppFiles({
    executablePath: request.executablePath,
    stdin: request.stdin,
    timeoutMs: request.timeoutMs
  })

  const outputMatches = await cleanOutput(executionResult.stdout) === await cleanOutput(request.expectedOutput)

  return {
    passed: outputMatches,
    expectedOutput: request.expectedOutput,
    actualOutput: executionResult.stdout,
    message: outputMatches ? 'Output matches expected output.' : 'Output does not match expected output.'
  }
} 

export { judgeCppFiles }

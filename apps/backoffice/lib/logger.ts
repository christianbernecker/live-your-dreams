interface LogLevel {
  DEBUG: 0
  INFO: 1
  WARN: 2
  ERROR: 3
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

interface LogEntry {
  timestamp: string
  level: keyof LogLevel
  message: string
  data?: any
  context?: {
    userId?: string
    userEmail?: string
    userAgent?: string
    url?: string
    sessionId?: string
  }
}

class Logger {
  private currentLevel: number
  private context: LogEntry['context'] = {}

  constructor(level: keyof LogLevel = 'INFO') {
    this.currentLevel = LOG_LEVELS[level]
  }

  setContext(context: Partial<LogEntry['context']>) {
    this.context = { ...this.context, ...context }
  }

  private shouldLog(level: keyof LogLevel): boolean {
    return LOG_LEVELS[level] >= this.currentLevel
  }

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, data, context } = entry
    let logString = `[${timestamp}] ${level}: ${message}`
    
    if (context && Object.keys(context).length > 0) {
      logString += ` | Context: ${JSON.stringify(context)}`
    }
    
    if (data) {
      logString += ` | Data: ${JSON.stringify(data, null, 2)}`
    }
    
    return logString
  }

  private async persistLog(entry: LogEntry) {
    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      try {
        // Example: Send to external logging service
        // await fetch('/api/logs', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(entry)
        // })
      } catch (error) {
        console.error('Failed to persist log:', error)
      }
    }
  }

  private createLogEntry(
    level: keyof LogLevel,
    message: string,
    data?: any
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      context: { ...this.context }
    }
  }

  debug(message: string, data?: any) {
    if (!this.shouldLog('DEBUG')) return

    const entry = this.createLogEntry('DEBUG', message, data)
    console.debug(this.formatLog(entry))
    this.persistLog(entry)
  }

  info(message: string, data?: any) {
    if (!this.shouldLog('INFO')) return

    const entry = this.createLogEntry('INFO', message, data)
    console.info(this.formatLog(entry))
    this.persistLog(entry)
  }

  warn(message: string, data?: any) {
    if (!this.shouldLog('WARN')) return

    const entry = this.createLogEntry('WARN', message, data)
    console.warn(this.formatLog(entry))
    this.persistLog(entry)
  }

  error(message: string, data?: any) {
    if (!this.shouldLog('ERROR')) return

    const entry = this.createLogEntry('ERROR', message, data)
    console.error(this.formatLog(entry))
    this.persistLog(entry)
  }

  // Specific methods for common scenarios
  apiCall(method: string, url: string, statusCode: number, duration: number) {
    this.info(`API ${method} ${url}`, {
      statusCode,
      duration,
      timestamp: Date.now()
    })
  }

  userAction(action: string, userId: string, details?: any) {
    this.info(`User action: ${action}`, {
      userId,
      details,
      timestamp: Date.now()
    })
  }

  authEvent(event: 'login' | 'logout' | 'failed_login', userId?: string, details?: any) {
    this.info(`Auth event: ${event}`, {
      userId,
      details,
      timestamp: Date.now()
    })
  }

  securityAlert(message: string, severity: 'low' | 'medium' | 'high', details?: any) {
    this.error(`SECURITY ALERT [${severity.toUpperCase()}]: ${message}`, details)
  }

  performanceMetric(metric: string, value: number, unit: string) {
    this.debug(`Performance: ${metric}`, {
      value,
      unit,
      timestamp: Date.now()
    })
  }
}

// Create singleton instance
const logger = new Logger(
  process.env.NODE_ENV === 'development' ? 'DEBUG' : 'INFO'
)

// Auto-set browser context if available
if (typeof window !== 'undefined') {
  logger.setContext({
    userAgent: window.navigator.userAgent,
    url: window.location.href
  })
}

export default logger

// Utility functions for common logging patterns
export const logApiError = (error: Error, endpoint: string, statusCode?: number) => {
  logger.error(`API Error at ${endpoint}`, {
    message: error.message,
    stack: error.stack,
    statusCode,
    endpoint
  })
}

export const logUserAction = (action: string, userId: string, details?: any) => {
  logger.userAction(action, userId, details)
}

export const logAuthEvent = (event: 'login' | 'logout' | 'failed_login', userId?: string) => {
  logger.authEvent(event, userId)
}

export const logSecurityAlert = (message: string, severity: 'low' | 'medium' | 'high' = 'medium', details?: any) => {
  logger.securityAlert(message, severity, details)
}

// Performance logging utilities
export const measurePerformance = <T>(
  operation: string,
  fn: () => T | Promise<T>
): T | Promise<T> => {
  const start = performance.now()
  
  const result = fn()
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const duration = performance.now() - start
      logger.performanceMetric(operation, duration, 'ms')
    })
  } else {
    const duration = performance.now() - start
    logger.performanceMetric(operation, duration, 'ms')
    return result
  }
}

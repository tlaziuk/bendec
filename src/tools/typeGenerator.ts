import * as fs from 'fs'
import { range } from 'lodash'
import { normalizeTypes } from '../utils'
import { TypeDefinition, TypeDefinitionStrict, Field } from '../'
import { Kind, EnumStrict, UnionStrict } from '../types'

type TypeMapping = { [k: string]: string }

type Options = {
  typeMapping?: TypeMapping
  namespace?: string
}

export const defaultOptions = {
  namespace: 'messages',
}

export const defaultMapping: TypeMapping = {
  'char[]': 'Buffer',
}

const indent = (i: number) => (str: string) => {
  return '                    '.substr(-i) + str
}

const getMembers = (fields: Field[], typeMap: TypeMapping) => {
  return fields.map(field => {
    const key = field.type + (field.length ? '[]' : '')
    const theType = typeMap[key] || key

    return `  ${field.name}: ${theType}`
  })
}

const getEnum = ({ name, variants }: EnumStrict) => {
  const variantsFields = variants.map(([key, value]) => `  ${key} = ${value},`).join('\n')
  return `export enum ${name} {
${variantsFields}
}`
}

const getUnion = ({ name, members }: UnionStrict) => {
  const unionMembers = members.join(' | ')
  return `export type ${name} = ${unionMembers}`
}

/**
 * Generate TypeScript interfaces from Bendec types definitions
 */
export const generateString = (typesDuck: TypeDefinition[], options: Options = defaultOptions) => {
  const types: TypeDefinitionStrict[] = normalizeTypes(typesDuck)
  const { namespace, typeMapping } = { ...defaultOptions, ...options }
  const typeMap: TypeMapping = { ...defaultMapping, ...typeMapping }

  const definitions = types.map(typeDef => {
    const typeName = typeDef.name

    if (typeMap[typeName]) {
      return `export type ${typeName} = ${typeMap[typeName]}`
    }

    if (typeDef.kind === Kind.Primitive) {
      return `export type ${typeName} = number`
    }

    if (typeDef.kind === Kind.Alias) {
      return `export type ${typeName} = ${typeDef.alias}`
    }

    if (typeDef.kind === Kind.Union) {
      return getUnion(typeDef)
    }

    if (typeDef.kind === Kind.Enum) {
      return getEnum(typeDef)
    }

    if (typeDef.kind === Kind.Struct) {
      const members = typeDef.fields
        ? getMembers(typeDef.fields, typeMap)
        : []

      const membersString = members.join('\n')

      return `export interface ${typeName} {
${membersString}
}`
    }
  })

  const result = definitions.join('\n\n')

  if (namespace) {
    return `/** GENERATED BY BENDEC TYPE GENERATOR */
namespace ${namespace} {
  ${result}
}

export = ${options.namespace}
`
  }

  return result
}

/**
 * Generate TypeScript interfaces from Bender types definitions
 */
export const generate = (types: any[], fileName: string, options?: Options) => {
  const moduleWrapped = generateString(types, options)

  fs.writeFileSync(fileName, moduleWrapped)
  console.log(`WRITTEN: ${fileName}`)
}
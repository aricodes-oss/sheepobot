import { wrapHandlerFunc } from 'utils';
import add from './add';
import alias from './alias';
import remove from './remove';
import permissions from './permissions';

export default [add, alias, remove, permissions].map(wrapHandlerFunc);

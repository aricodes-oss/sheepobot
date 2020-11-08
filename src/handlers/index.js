import { wrapHandlerFunc } from 'utils';
import add from './add';
import alias from './alias';
import remove from './remove';
import permissions from './permissions';
import edit from './edit';

export default [add, alias, remove, permissions, edit].map(wrapHandlerFunc);

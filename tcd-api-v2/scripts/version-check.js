const fs = require( 'fs' );
const childProcessExec = require( 'child_process' ).exec;
const util = require( 'util' );
const exec = util.promisify( childProcessExec );

updateChangelogVersion();

async function updateChangelogVersion () {
    let version = require( '../package.json' ).version;
    if (!version.includes('snapshot')) {
        const unreleasedTag = `Unreleased\r\n\r\n`;
        console.log( `Moving Unlreleased issues to ${ version }` );
        let changeLog = fs.readFileSync( './CHANGELOG.md', 'utf8' );
        var newValue = changeLog.replace( 'Unreleased', `${unreleasedTag}## ${version}` );
        fs.writeFileSync( './CHANGELOG.md', newValue, 'utf-8' );
        console.log( 'Staging CHANGELOG.md...' );
        await exec( 'git add ./CHANGELOG.md' );
        console.log( 'Committing CHANGELOG...' );
        await exec( `git commit -m 'Update CHANGELOG.md with version' --no-verify` );
        console.log( 'Done committing CHANGELOG...' );
    }
    return;
}